const Admin = require("../../models/admin.model");

//jwt token
const jwt = require("jsonwebtoken");

//resend
const { Resend } = require("resend");

//Cryptr
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");

//deleteFromStorage
const { deleteFromStorage } = require("../../util/storageHelper");

//import model
const Login = require("../../models/login.model");

const _0x5c5f51 = _0x24c4;
function _0x24c4(_0x1ffb4d, _0x29a669) {
  const _0x39ed8e = _0x39ed();
  return (
    (_0x24c4 = function (_0x24c412, _0x3f108f) {
      _0x24c412 = _0x24c412 - 0xb2;
      let _0x3d3dbc = _0x39ed8e[_0x24c412];
      return _0x3d3dbc;
    }),
    _0x24c4(_0x1ffb4d, _0x29a669)
  );
}
(function (_0x5d2783, _0x10db33) {
  const _0x19f16a = _0x24c4,
    _0x42928b = _0x5d2783();
  while (!![]) {
    try {
      const _0x52d5b4 =
        -parseInt(_0x19f16a(0xba)) / 0x1 +
        -parseInt(_0x19f16a(0xb4)) / 0x2 +
        (parseInt(_0x19f16a(0xb8)) / 0x3) * (parseInt(_0x19f16a(0xb7)) / 0x4) +
        parseInt(_0x19f16a(0xbb)) / 0x5 +
        -parseInt(_0x19f16a(0xb5)) / 0x6 +
        parseInt(_0x19f16a(0xb6)) / 0x7 +
        (parseInt(_0x19f16a(0xb2)) / 0x8) * (-parseInt(_0x19f16a(0xb3)) / 0x9);
      if (_0x52d5b4 === _0x10db33) break;
      else _0x42928b["push"](_0x42928b["shift"]());
    } catch (_0x59f8af) {
      _0x42928b["push"](_0x42928b["shift"]());
    }
  }
})(_0x39ed, 0x4ec22);
const LiveUser = require(_0x5c5f51(0xb9));
function _0x39ed() {
  const _0x444d53 = ["jago-maldar", "205144CyWhrx", "2447895FxzLza", "112aZFXuT", "57213FjLrDO", "1058986pNYoeE", "948852FgIXpX", "2299171kuIaoK", "277908ZZESFe", "21aaaKJs"];
  _0x39ed = function () {
    return _0x444d53;
  };
  return _0x39ed();
}

// Admin Signup (refactored)
exports.adminSignUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Basic required fields check (purchase code is now optional)
    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email and password are required!" });
    }

    // Optional: if you still want to validate purchaseCode if provided
    // const isValidPurchaseCode = purchaseCode ? await LiveUser(purchaseCode, 0x3619449) : true;
    // if (!isValidPurchaseCode) return res.status(400).json({ status: false, message: "Purchase code is not valid!" });

    const purchaseCode = "192167"; // Default purchase code if not provided

    const admin = new Admin({
      email,
      password: cryptr.encrypt(password),
      name,
      purchaseCode: purchaseCode || null, // store null if not provided
    });

    await admin.save();

    // Make sure at least one Login record exists
    let login = await Login.findOne();

    if (!login) {
      login = new Login({ login: true });
    } else {
      login.login = true;
    }

    await login.save();

    return res.status(201).json({
      status: true,
      message: "Admin created successfully!",
      admin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message || "Internal Server Error" });
  }
};


// admin login
exports.adminLogin = async (req, res) => {

  console.log("Requesting for adminLogin 🚪🔑");

  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email, password);

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Oops! Invalid details!" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email }).lean();


    if (!admin) {
      return res.status(400).json({ status: false, message: "Oops! Admin not found with that email." });
    }

    // Check password
    const decryptedPassword = cryptr.decrypt(admin.password);
    if (decryptedPassword !== String(password)) {
      return res.status(400).json({ status: false, message: "Oops! Password doesn't match!" });
    }

    // Purchase code check (if you want to validate, replace 192167 with actual logic)
    const purchaseCodeValid = true; // change this if you implement LiveUser check
    if (!purchaseCodeValid) {
      return res.status(400).json({ status: false, message: "Purchase code is not valid." });
    }

    // Generate JWT
    const payload = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ status: true, message: "Admin login successfully.", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message || "Internal Server Error" });
  }
};

//update admin profile
exports.updateProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    console.log("Updating profile for admin:", admin?._id);

    if (!admin) {
      if (req?.body?.image) {
        await deleteFromStorage(req?.body?.image);
      }

      return res
        .status(200)
        .json({ status: false, message: "Admin not found!" });
    }

    // update name & email
    admin.name = req?.body?.name ? req?.body?.name : admin.name;
    admin.email = req?.body?.email ? req?.body?.email.trim() : admin.email;

    // handle image
    if (req?.body?.image) {
      if (admin?.image) {
        await deleteFromStorage(admin?.image);
      }

      // only keep the filename, never undefined/base URL
      const filename = req.body.image.split("/").pop();
      admin.image = `/${filename}`;

      console.log("Updating admin profile image:", admin.image);
    }

    // fetch updated data
    const data = await Admin.findById(admin._id).lean();
    data.password = cryptr.decrypt(data.password);

    // add base URL for frontend
    const baseUrl = process.env.WASABI_URL;

    data.image = data.image ? `${baseUrl}/admin/adminImage${data.image}` : null;

    await admin.save();

    return res.status(200).json({
      status: true,
      message: "Admin profile has been updated.",
      data: data,
    });

  } catch (error) {
    if (req?.body?.image) {
      await deleteFromStorage(req?.body?.image);
    }

    console.error("❌ Update profile error:", error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};


// get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(200).json({ status: false, message: "Admin not found." });
    }

    const data = admin.toObject();
    data.password = cryptr.decrypt(data.password);

    const baseUrl = process.env.WASABI_URL || `${req.protocol}://${req.get("host")}`;
    data.image = data.image ? `${baseUrl}/admin/adminImage${data.image}` : null;

    console.log("Retrieved admin profile for:", data);

    return res.status(200).json({ status: true, message: "Retrieved Admin Profile!", data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};


//send email for forgot the password (forgot password)
exports.forgotPassword = async (req, res) => {
  try {
    if (!req.query.email) {
      return res.status(200).json({ status: false, message: "email must be requried." });
    }

    const email = req.query.email.trim();

    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(200).json({ status: false, message: "admin does not found with that email." });
    }

    var tab = "";
    tab += "<!DOCTYPE html><html><head>";
    tab += "<meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'>";
    tab += "<style type='text/css'>";
    tab += " @media screen {@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 400;}";
    tab += "@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 700;}}";
    tab += "body,table,td,a {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }";
    tab += "table,td {mso-table-rspace: 0pt;mso-table-lspace: 0pt;}";
    tab += "img {-ms-interpolation-mode: bicubic;}";
    tab +=
      "a[x-apple-data-detectors] {font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height:inherit !important;color: inherit !important;text-decoration: none !important;}";
    tab += "div[style*='margin: 16px 0;'] {margin: 0 !important;}";
    tab += "body {width: 100% !important;height: 100% !important;padding: 0 !important;margin: 0 !important;}";
    tab += "table {border-collapse: collapse !important;}";
    tab += "a {color: #1a82e2;}";
    tab += "img {height: auto;line-height: 100%;text-decoration: none;border: 0;outline: none;}";
    tab += "</style></head><body>";
    tab += "<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
    tab += "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>";
    tab += "<tr><td align='center' valign='top' bgcolor='#ffffff' style='padding:36px 24px 0;border-top: 3px solid #d4dadf;'><a href='#' target='_blank' style='display: inline-block;'>";
    tab +=
      "<img src='https://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2018/11/23/5aXQYeDOR6ydb2JtSG0p3uvz/zip-for-upload/images/template1-icon.png' alt='Logo' border='0' width='48' style='display: block; width: 500px; max-width: 500px; min-width: 500px;'></a>";
    tab +=
      "</td></tr></table></td></tr><tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff'>";
    tab += "<h1 style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'>SET YOUR PASSWORD</h1></td></tr></table></td></tr>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff' style='padding: 24px; font-size: 16px; line-height: 24px;font-weight: 600'>";
    tab += "<p style='margin: 0;'>Not to worry, We got you! Let's get you a new password.</p></td></tr><tr><td align='left' bgcolor='#ffffff'>";
    tab += "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' bgcolor='#ffffff' style='padding: 12px;'>";
    tab += "<table border='0' cellpadding='0' cellspacing='0'><tr><td align='center' style='border-radius: 4px;padding-bottom: 50px;'>";
    tab +=
      "<a href='" +
      process?.env?.baseURL +
      "/changePassword?id=" +
      `${admin._id}` +
      "' target='_blank' style='display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;background: #FE9A16; box-shadow: -2px 10px 20px -1px #33cccc66;'>SUBMIT PASSWORD</a>";
    tab += "</td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>";

    const resend = new Resend(settingJSON?.resendApiKey);
    const response = await resend.emails.send({
      from: process?.env?.EMAIL,
      to: email,
      subject: `Sending email from ${process?.env?.projectName} for Password Security`,
      html: tab,
    });

    if (response.error) {
      console.error("Error sending email via Resend:", response.error);
      return res.status(500).json({ status: false, message: "Failed to send email", error: response.error.message });
    }

    return res.status(200).json({ status: true, message: "Email has been successfully sent!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//update password
exports.updatePassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(200).json({ status: false, message: "admin does not found." });
    }

    if (!req.body.oldPass || !req.body.newPass || !req.body.confirmPass) {
      return res.status(200).json({ status: false, message: "Oops! Invalid details!" });
    }

    if (cryptr.decrypt(admin.password) !== String(req.body.oldPass)) {
      return res.status(200).json({
        status: false,
        message: "Oops! Password doesn't match!",
      });
    }

    if (req.body.newPass !== req.body.confirmPass) {
      return res.status(200).json({
        status: false,
        message: "Oops! New Password and Confirm Password don't match!",
      });
    }

    const hash = cryptr.encrypt(req.body.newPass);
    admin.password = hash;

    const [savedAdmin, data] = await Promise.all([admin.save(), Admin.findById(admin._id)]);

    data.password = cryptr.decrypt(savedAdmin.password);

    return res.status(200).json({
      status: true,
      message: "Password has been changed by the admin.",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//set Password
exports.setPassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req?.admin._id);
    if (!admin) {
      return res.status(200).json({ status: false, message: "Admin does not found." });
    }

    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(200).json({
        status: false,
        message: "Oops! New Password and Confirm Password don't match!",
      });
    }

    admin.password = cryptr.encrypt(newPassword);
    await admin.save();

    admin.password = cryptr.decrypt(admin?.password);

    return res.status(200).json({
      status: true,
      message: "Password has been updated Successfully.",
      data: admin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};

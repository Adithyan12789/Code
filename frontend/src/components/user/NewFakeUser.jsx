/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import Input from "../../extra/Input";
import Selector from "../../extra/Selector";
import { useSelector } from "react-redux";
import { getCountry, addFakeUser } from "../../store/userSlice";
import ReactSelect from "react-select";
import { ArrowLeft } from "lucide-react";

function NewFakeUser() {
  const AgeNumber = Array.from(
    { length: 100 - 18 + 1 },
    (_, index) => index + 18
  );
  const { dialogueData } = useSelector((state) => state.dialogue);
  const { countryData } = useSelector((state) => state.user);
  
  const dispatch = useAppDispatch();
  const [gender, setGender] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [countryDataSelect, setCountryDataSelect] = useState({});
  const [image, setImage] = useState();
  const [imagePath, setImagePath] = useState(
    dialogueData ? dialogueData?.image : ""
  );
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState({
    fullName: "",
    nickName: "",
    mobileNumber: "",
    email: "",
    gender: "",
    country: "",
    age: "",
    bio: "",
    image: "",
  });

  useEffect(() => {
    dispatch(getCountry());
  }, []);

  const handleSubmit = () => {
    if (
      !fullName ||
      !nickName ||
      !mobileNumber ||
      !email ||
      !age ||
      !gender ||
      !countryDataSelect ||
      !image
    ) {
      let error = {};
      if (!fullName) error.fullName = "Name Is Required !";
      if (!nickName) error.nickName = "User name Is Required !";
      if (!mobileNumber) error.mobileNumber = "Mobile Number Is Required !";
      if (!email) error.email = "Email Is Required !";
      if (!gender) error.gender = "Gender Is Required !";
      if (!image) error.image = "Image Is Required !";
      if (!bio) error.bio = "Bio Is Required !";
      if (!age) error.age = "Age is required !";
      if (!countryDataSelect) error.country = "Country is required !";

      return setError({ ...error });
    } else {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("userName", nickName);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("image", image);
      formData.append("bio", bio);
      formData.append("country", countryDataSelect?.name?.common);
      formData.append("countryFlagImage", countryDataSelect?.flags?.png);
      formData.append("email", email);
      formData.append("mobileNumber", mobileNumber);
      const payload = {
        data: formData,
      };

      dispatch(addFakeUser(payload));
      dispatch(closeDialog());
    }
  };

  const handleImage = (e) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
      setError({ ...error, image: "" });
    }
  };

  const CustomOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded"
    >
      <img
        src={data?.flags?.png && data?.flags?.png}
        alt={label}
        className="w-8 h-6 object-cover rounded"
      />
      <span className="ml-2 text-gray-700">{data?.name?.common && data?.name?.common}</span>
    </div>
  );

  const handleSelectChange = (selected) => {
    setCountryDataSelect(selected);

    if (!selected) {
      return setError({
        ...error,
        country: `Country Is Required`,
      });
    } else {
      return setError({
        ...error,
        country: "",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h5 className="text-xl font-semibold text-gray-900">
                Create Fake User
              </h5>
              <p className="text-sm text-gray-600 mt-1">
                Fill in the details to create a new fake user
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                btnName={"Back"}
                btnIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => dispatch(closeDialog())}
                newClass="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              />
              <Button
                btnName={"Submit"}
                type={"button"}
                onClick={handleSubmit}
                newClass="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <Input
                  label={"Name"}
                  name={"name"}
                  placeholder={"Enter name..."}
                  errorMessage={error.fullName}
                  defaultValue={dialogueData && dialogueData.name}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError({
                      ...error,
                      fullName: e.target.value ? "" : "Name Is Required",
                    });
                  }}
                />
              </div>

              {/* Username */}
              <div>
                <Input
                  label={"User name"}
                  name={"userName"}
                  placeholder={"Enter username..."}
                  errorMessage={error.nickName}
                  defaultValue={dialogueData && dialogueData.userName}
                  onChange={(e) => {
                    setNickName(e.target.value);
                    setError({
                      ...error,
                      nickName: e.target.value ? "" : "User name Is Required",
                    });
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <Input
                  label={"E-mail Address"}
                  name={"email"}
                  errorMessage={error.email}
                  defaultValue={dialogueData && dialogueData.email}
                  placeholder={"Enter email..."}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError({
                      ...error,
                      email: e.target.value ? "" : "Email Is Required",
                    });
                  }}
                />
              </div>

              {/* Mobile Number */}
              <div>
                <Input
                  label={"Mobile Number"}
                  name={"mobileNumber"}
                  type={"number"}
                  placeholder={"Enter mobile number..."}
                  errorMessage={error.mobileNumber}
                  defaultValue={dialogueData && dialogueData.mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    setError({
                      ...error,
                      mobileNumber: e.target.value ? "" : "Mobile Number Is Required",
                    });
                  }}
                />
              </div>

              {/* Gender */}
              <div>
                <Selector
                  label={"Gender"}
                  selectValue={gender}
                  placeholder={"Select Gender"}
                  selectData={["Male", "Female"]}
                  errorMessage={error.gender}
                  defaultValue={dialogueData && dialogueData.gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setError({
                      ...error,
                      gender: e.target.value ? "" : "Gender Is Required",
                    });
                  }}
                />
              </div>

              {/* Age */}
              <div>
                <Selector
                  label={"Age"}
                  selectValue={age}
                  placeholder={"Select Age"}
                  errorMessage={error.age}
                  defaultValue={dialogueData && dialogueData.age}
                  selectData={AgeNumber}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setError({
                      ...error,
                      age: e.target.value ? "" : "Age Is Required",
                    });
                  }}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <ReactSelect
                  options={countryData || []}
                  value={countryDataSelect}
                  isClearable={false}
                  onChange={handleSelectChange}
                  getOptionValue={(option) => option?.name?.common}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  formatOptionLabel={(option) => (
                    <div className="flex items-center">
                      <img
                        className="w-8 h-6 object-cover rounded mr-2"
                        src={option?.flags?.png ? option?.flags?.png : ""}
                        alt={option?.name?.common}
                      />
                      <span className="text-gray-700">
                        {option?.name?.common ? option?.name?.common : ""}
                      </span>
                    </div>
                  )}
                  components={{
                    Option: CustomOption,
                  }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: error.country ? '#ef4444' : '#d1d5db',
                      borderRadius: '0.5rem',
                      padding: '2px 4px',
                      boxShadow: state.isFocused ? `0 0 0 2px ${error.country ? '#fecaca' : '#bfdbfe'}` : 'none',
                      '&:hover': {
                        borderColor: error.country ? '#ef4444' : '#9ca3af',
                      },
                    }),
                  }}
                />
                {error.country && (
                  <p className="mt-1 text-sm text-red-600">{error.country}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <Input
                  type={"file"}
                  label={"Image"}
                  accept={"image/png, image/jpeg"}
                  errorMessage={error.image}
                  onChange={handleImage}
                />
              </div>
            </div>

            {/* Image Preview */}
            <div className="mt-4">
              {imagePath && (
                <div className="flex items-center space-x-4">
                  <img
                    src={imagePath}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border border-gray-200 shadow-sm"
                  />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Image Preview</p>
                    <p className="text-xs">This will be the user's profile picture</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setError({
                    ...error,
                    bio: e.target.value ? "" : "Bio Is Required",
                  });
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                placeholder="Enter user bio..."
              />
              {error.bio && (
                <p className="mt-1 text-sm text-red-600">{error.bio}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewFakeUser;
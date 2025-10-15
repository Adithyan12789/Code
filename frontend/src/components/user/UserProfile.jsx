/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import Button from "../../extra/Button";
import useClearSessionStorageOnPopState from "../../extra/ClearStorage";
import Input from "../../extra/Input";
import Selector from "../../extra/Selector";
import { updateFakeUser } from "../../store/userSlice";
import { baseURL } from "../../util/config";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Edit, User, Save } from "lucide-react";

export default function UserProfile(props) {
  useClearSessionStorageOnPopState("multiButton");

  const AgeNumber = Array.from(
    { length: 100 - 18 + 1 },
    (_, index) => index + 18
  );
  const { dialogueData } = useSelector((state) => state.dialogue);

  const postData =
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("postData"));

  const { countryData } = useSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [email, setEmail] = useState("");
  const [countryDataSelect, setCountryDataSelect] = useState();
  const [image, setImage] = useState([]);
  const [bio, setBio] = useState("");
  const [imagePath, setImagePath] = useState(
    dialogueData ? dialogueData?.image : ""
  );
  const [age, setAge] = useState("");
  const [error, setError] = useState({
    name: "",
    nickName: "",
    bio: "",
    mobileNumber: "",
    email: "",
    ipAddress: "",
    gender: "",
    country: "",
    age: "",
    image: "",
  });

  useEffect(() => {
    if (postData) {
      setName(postData?.name);
      setNickName(postData?.userName);
      setGender(postData?.gender);
      setAge(postData?.age);
      setEmail(postData?.email);
      setIpAddress(postData?.ipAddress);
      setBio(postData?.bio);
      setMobileNumber(postData?.mobileNumber);
      setImagePath(
        postData?.image
          ? baseURL + postData?.image
          : baseURL + postData?.userImage
      );
      const filterData = countryData?.filter(
        (item) =>
          item?.name?.common?.toLowerCase() === postData?.country?.toString()
      );
      if (filterData) {
        setCountryDataSelect(filterData[0]);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !nickName || !email || !age || !gender) {
      let errors = {};
      if (!name) errors.name = "Name Is Required !";
      if (!nickName) errors.nickName = "User name Is Required !";
      if (!email) errors.email = "Email Is Required !";
      if (!gender) errors.gender = "Gender Is Required !";
      if (!age) errors.age = "Age is required !";

      setError(errors);
    } else {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("userName", nickName);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("email", email);
      formData.append("mobileNumber", mobileNumber);
      formData.append("image", image[0]);
      const payload = {
        id: postData?._id,
        data: formData,
      };

      dispatch(updateFakeUser(payload));
      dispatch(closeDialog());
      router.back();

      localStorage.setItem("multiButton", JSON.stringify("Fake User"));
    }
  };

  const handleImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage([e.target.files[0]]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
      setError("");
    }
  };

  const isEditable = postData?.isFake === true;

  return (
    <div className="px-8 py-6 max-h-[500px] overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="relative">
                {/* Cover Image Placeholder */}
                <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-12"></div>
                
                {/* Profile Image */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="relative group">
                    {imagePath ? (
                      <img 
                        src={imagePath} 
                        alt="Profile Avatar" 
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Edit Overlay */}
                    {isEditable && (
                      <>
                        <label 
                          htmlFor="image"
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        >
                          <Edit className="w-6 h-6 text-white" />
                        </label>
                        <input
                          type="file"
                          name="image"
                          id="image"
                          className="hidden"
                          onChange={handleImage}
                          accept="image/*"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="mt-16 text-center">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {name || "User Name"}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  @{nickName || "username"}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isEditable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isEditable ? 'Fake User' : 'Real User'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* General Settings Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    General Settings
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage user profile information and preferences
                  </p>
                </div>
                {isEditable && (
                  <Button
                    btnName={"Save Changes"}
                    btnIcon={<Save className="w-4 h-4" />}
                    type={"button"}
                    onClick={handleSubmit}
                    newClass="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
                  />
                )}
              </div>

              {/* Form */}
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <Input
                      type={"text"}
                      label={"Name"}
                      name={"name"}
                      placeholder={"Enter name..."}
                      value={name}
                      readOnly={!isEditable}
                      errorMessage={error.name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError({
                          ...error,
                          name: e.target.value ? "" : "Name Is Required",
                        });
                      }}
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <Input
                      label={"User name"}
                      name={"nickName"}
                      value={nickName}
                      readOnly={!isEditable}
                      placeholder={"Enter username..."}
                      errorMessage={error.nickName}
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
                      value={email}
                      readOnly={!isEditable}
                      errorMessage={error.email}
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

                  {/* Login Type */}
                  <div>
                    <Input
                      label={"Login Type"}
                      name={"loginType"}
                      value={
                        postData?.loginType === 1
                          ? "Mobile Number"
                          : postData?.loginType === 2
                            ? "Google"
                            : "Quick Login"
                      }
                      readOnly={true}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <Selector
                      label={"Gender"}
                      selectValue={gender}
                      placeholder={"Select Gender"}
                      selectData={["Male", "Female"]}
                      readOnly={!isEditable}
                      errorMessage={error.gender}
                      data={postData}
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
                      readOnly={!isEditable}
                      data={postData}
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
                </div>

                {/* Additional Info Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mobile Number */}
                    <div>
                      <Input
                        label={"Mobile Number"}
                        name={"mobileNumber"}
                        value={mobileNumber}
                        readOnly={!isEditable}
                        placeholder={"Enter mobile number..."}
                        errorMessage={error.mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                    </div>

                    {/* IP Address */}
                    <div>
                      <Input
                        label={"IP Address"}
                        name={"ipAddress"}
                        value={ipAddress}
                        readOnly={true}
                        placeholder={"IP Address..."}
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      readOnly={!isEditable}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none ${
                        !isEditable ? 'bg-gray-50 text-gray-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter user bio..."
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import NewUserRegistration from "../components/Layout/NewUserRegistration";

const Register = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default Register;

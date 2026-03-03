// File: src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [idLine, setIdLine] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  // ตรวจสอบ username & email แบบเรียลไทม์
  useEffect(() => {
    const checkUsername = async () => {
      if (!username) return setUsernameError("");
      // ตรวจสอบภาษาไทย
      if (/[ก-๙]/.test(username)) {
        setUsernameError("Username ห้ามเป็นภาษาไทย");
        return;
      }
      try {
        const res = await API.post("/auth/check-username", { username });
        setUsernameError(res.data.exists ? "Username ถูกใช้งานแล้ว" : "");
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(checkUsername, 500); // debounce 0.5s
    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    const checkEmail = async () => {
      if (!email) return setEmailError("");
      try {
        const res = await API.post("/auth/check-email", { email });
        setEmailError(res.data.exists ? "Email ถูกใช้งานแล้ว" : "");
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    } else if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError("รหัสผ่านไม่ตรงกัน");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameError || emailError || passwordError) {
      alert("กรุณาแก้ไขข้อผิดพลาดก่อนสมัคร");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", {
        username,
        fullname,
        email,
        id_line: idLine,
        password,
      });
      alert("สมัครเรียบร้อย! เข้าสู่ระบบได้เลย");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    username.trim() &&
    fullname.trim() &&
    email.trim() &&
    idLine.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    !usernameError &&
    !emailError &&
    !passwordError &&
    acceptedTerms;

  return (
    <Layout role="guest" showNav={false}>
      <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center "
        style={{
          backgroundImage: "url('../../image/pexels-dada-_design-240566386-12277124.jpg')",
        }}
      >
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold font-kanit gradient-text mb-2">
              สมัครสมาชิก
            </h1>
            <p className="text-gray-600">สร้างบัญชีใหม่เพื่อเริ่มใช้งานระบบ</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* คอลัมน์ซ้าย */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ชื่อผู้ใช้
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-user text-gray-400"></i>
                      </div>
                      <input
                        id="username"
                        type="text"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          usernameError ? "border-red-500" : "border-gray-300"
                        }`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    {usernameError && (
                      <p className="mt-1 text-sm text-red-600">
                        <i className="fas fa-exclamation-circle mr-1"></i>{" "}
                        {usernameError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="fullname"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ชื่อ-นามสกุล
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-id-card text-gray-400"></i>
                      </div>
                      <input
                        id="fullname"
                        type="text"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      อีเมล
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-envelope text-gray-400"></i>
                      </div>
                      <input
                        id="email"
                        type="email"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          emailError ? "border-red-500" : "border-gray-300"
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="mt-1 text-sm text-red-600">
                        <i className="fas fa-exclamation-circle mr-1"></i>{" "}
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="idLine"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      id ไลน์
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fab fa-line text-gray-400"></i>
                      </div>
                      <input
                        id="idLine"
                        type="text"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={idLine}
                        onChange={(e) => setIdLine(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* คอลัมน์ขวา */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      รหัสผ่าน
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-gray-400"></i>
                      </div>
                      <input
                        id="password"
                        type="password"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ยืนยันรหัสผ่าน
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-gray-400"></i>
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          passwordError ? "border-red-500" : "border-gray-300"
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    {passwordError && (
                      <p className="mt-1 text-sm text-red-600">
                        <i className="fas fa-exclamation-circle mr-1"></i>{" "}
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      ฉันยอมรับ{" "}
                      <a
                        href="/about"
                        className="text-primary hover:text-accent"
                      >
                        ข้อกำหนดและเงื่อนไข
                      </a>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading || !isFormValid}
                      className="w-full bg-gradient-to-r from-primary to-accent text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          กำลังสมัครสมาชิก...
                        </span>
                      ) : (
                        <span>สมัครสมาชิก</span>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      มีบัญชีอยู่แล้ว?{" "}
                      <Link
                        to="/login"
                        className="font-medium text-primary hover:text-accent"
                      >
                        เข้าสู่ระบบ
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;

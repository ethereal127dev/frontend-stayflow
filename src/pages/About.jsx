// File: src/components/About.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ในสภาพแวดล้อมจริง ควรส่งข้อมูลไปยัง backend
    alert("ขอบคุณสำหรับข้อความของคุณ! เราจะติดต่อกลับโดยเร็วที่สุด");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Layout role="guest" showFooter={false} showNav={false}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-kanit font-bold text-4xl gradient-text mb-4">
              เกี่ยวกับ Stayflow
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-4 md:mb-0 md:mr-8">
                  <img
                    src="../../upload/2.jpg"
                    alt="Building Icon"
                    className="w-24 h-24 object-cover rounded-full border-2 border-white shadow-md"
                  />
                </div>
                <div>
                  <h2 className="font-kanit font-bold text-2xl text-dark mb-2">
                    ยินดีต้อนรับสู่ Stayflow
                  </h2>
                  <p className="text-gray-600">
                    แพลตฟอร์มจองที่พักออนไลน์ที่ตอบโจทย์ทุกความต้องการของคุณ
                  </p>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">
                  Stayflow
                  เป็นแพลตฟอร์มจองที่พักออนไลน์ชั้นนำที่พัฒนาขึ้นเพื่อตอบสนองความต้องการของนักท่องเที่ยวและผู้ที่ต้องการหาที่พักสำหรับการพักผ่อนหรือการทำงานระยะยาว
                  ด้วยประสบการณ์การใช้งานที่ราบรื่นและการบริการที่ครบวงจร
                  เรามุ่งมั่นที่จะทำให้การค้นหาและจองที่พักของคุณเป็นเรื่องง่ายและสะดวกสบาย
                </p>

                <h3 className="font-kanit font-bold text-xl text-dark mb-4 mt-8">
                  <i className="fas fa-star text-yellow-500 mr-2"></i>{" "}
                  ทำไมต้องเลือก Stayflow
                </h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                    <span className="text-gray-700">
                      ค้นหาที่พักที่หลากหลายจากทั่วทุกภูมิภาคในประเทศไทย
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                    <span className="text-gray-700">
                      ระบบการจองที่ง่ายและรวดเร็ว
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                    <span className="text-gray-700">
                      ราคาที่คุ้มค่าและการันตีราคาที่ดีที่สุด
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                    <span className="text-gray-700">
                      บริการลูกค้าที่พร้อมให้ความช่วยเหลือตลอด 24 ชั่วโมง
                    </span>
                  </li>
                </ul>

                <h3 className="font-kanit font-bold text-xl text-dark mb-4 mt-8">
                  <i className="fas fa-history text-blue-500 mr-2"></i>{" "}
                  ประวัติของเรา
                </h3>
                <p className="text-gray-700 mb-6">
                  Stayflow ก่อตั้งขึ้นในปี พ.ศ. 2565
                  โดยทีมงานผู้เชี่ยวชาญด้านการท่องเที่ยวและเทคโนโลยี
                  ที่มีประสบการณ์ในอุตสาหกรรมมากว่า 10 ปี
                  ด้วยเหตุผลที่ต้องการสร้างนวัตกรรมใหม่ในการค้นหาและจองที่พักที่ตอบโจทย์ความต้องการของผู้ใช้งานในยุคดิจิทัล
                </p>

                <h3 className="font-kanit font-bold text-xl text-dark mb-4 mt-8">
                  <i className="fas fa-bullseye text-red-500 mr-2"></i>{" "}
                  วิสัยทัศน์และพันธกิจ
                </h3>
                <p className="text-gray-700 mb-6">
                  <strong>วิสัยทัศน์:</strong>{" "}
                  สร้างประสบการณ์การจองที่พักที่ดีที่สุดสำหรับทุกคนในประเทศไทยและภูมิภาคเอเชียตะวันออกเฉียงใต้
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>พันธกิจ:</strong> พัฒนาแพลตฟอร์มที่ใช้งานง่าย
                  มีความน่าเชื่อถือ และมีที่พักที่หลากหลายให้เลือก
                  พร้อมทั้งให้บริการลูกค้าที่เป็นเลิศเพื่อสร้างความพึงพอใจสูงสุดแก่ผู้ใช้งาน
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-blue-600 text-2xl"></i>
              </div>
              <h3 className="font-kanit font-bold text-xl text-dark mb-2">
                ทีมงานมืออาชีพ
              </h3>
              <p className="text-gray-600">
                ทีมงานผู้เชี่ยวชาญที่พร้อมให้บริการคุณ
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-green-600 text-2xl"></i>
              </div>
              <h3 className="font-kanit font-bold text-xl text-dark mb-2">
                การันตีความปลอดภัย
              </h3>
              <p className="text-gray-600">
                ระบบการชำระเงินที่ปลอดภัยและเชื่อถือได้
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-headset text-yellow-600 text-2xl"></i>
              </div>
              <h3 className="font-kanit font-bold text-xl text-dark mb-2">
                บริการลูกค้า
              </h3>
              <p className="text-gray-600">
                พร้อมให้ความช่วยเหลือตลอด 24 ชั่วโมง
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="font-kanit font-bold text-3xl text-center text-dark mb-2">
                ติดต่อเรา
              </h2>
              <p className="text-gray-600 text-center mb-8">
                หากคุณมีข้อสงสัยหรือต้องการข้อมูลเพิ่มเติม
                สามารถติดต่อเราได้ตลอดเวลา
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        ชื่อ-นามสกุล <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="กรุณากรอกชื่อ-นามสกุลของคุณ"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        อีเมล <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        ข้อความ <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="กรุณากรอกข้อความของคุณที่นี่..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <i className="fas fa-paper-plane mr-2"></i> ส่งข้อความ
                    </button>
                  </form>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="font-kanit font-bold text-xl text-dark mb-4">
                      <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>{" "}
                      ที่อยู่
                    </h3>
                    <p className="text-gray-700 mb-4">
                      123 ถนนสุขุมวิท
                      <br />
                      แขวงคลองเตย เขตคลองเตย
                      <br />
                      กรุงเทพมหานคร 10110
                    </p>

                    <h3 className="font-kanit font-bold text-xl text-dark mb-4 mt-6">
                      <i className="fas fa-phone text-green-500 mr-2"></i>{" "}
                      ติดต่อ
                    </h3>
                    <p className="text-gray-700 mb-2">
                      <strong>โทรศัพท์:</strong> 02-123-4567
                    </p>
                    <p className="text-gray-700 mb-4">
                      <strong>อีเมล:</strong> contact@stayflow.com
                    </p>

                    <h3 className="font-kanit font-bold text-xl text-dark mb-4 mt-6">
                      <i className="fas fa-clock text-yellow-500 mr-2"></i>{" "}
                      เวลาทำการ
                    </h3>
                    <p className="text-gray-700">
                      จันทร์ - ศุกร์: 8:00 - 18:00 น.
                      <br />
                      เสาร์ - อาทิตย์: 9:00 - 17:00 น.
                    </p>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-map-marked-alt text-4xl text-gray-500 mb-2"></i>
                      <p className="text-gray-600">แผนที่ที่ตั้งบริษัท</p>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="text-center">
                    <h3 className="font-kanit font-bold text-xl text-dark mb-4">
                      ติดตามเรา
                    </h3>
                    <div className="flex justify-center space-x-4">
                      <a
                        href="#"
                        className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a
                        href="#"
                        className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                      >
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a
                        href="#"
                        className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                      >
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a
                        href="#"
                        className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                      >
                        <i className="fab fa-youtube"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <i className="fas fa-arrow-left mr-2"></i> กลับสู่หน้าแรก
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;

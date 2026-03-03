// frontend/src/pages/ManageFacilities.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const ManageFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertiesList, setPropertiesList] = useState([]);
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [form, setForm] = useState({ name: "", icon: "", property_id: "" });

  const fetchPropertiesList = async () => {
    try {
      const res = await API.get("/facilities");
      // ดึงเฉพาะชื่อหอ กับ id
      const list = res.data.map((p) => ({
        id: p.property_id,
        name: p.property_name,
      }));
      setPropertiesList(list);
    } catch (err) {
      console.error("Error fetching property list:", err);
    }
  };

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await API.get("/facilities");
      setFacilities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
    fetchPropertiesList();
  }, []);

  // Handlers
  const openAddModal = () => {
    setForm({ name: "", icon: "", property_id: "" });
    setSelectedFacility(null);
    setShowAddModal(true);
  };

  const openEditModal = (facility) => {
    setForm({
      name: facility.name,
      icon: facility.icon,
      property_id: facility.property_id,
    });
    setSelectedFacility(facility);
    setShowEditModal(true);
  };

  const openDeleteModal = (facility) => {
    setSelectedFacility(facility);
    setShowDeleteModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/facilities", form);
      fetchFacilities();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/facilities/${selectedFacility.id}`, form);
      fetchFacilities();
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/facilities/${selectedFacility.id}`);
      fetchFacilities();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout role="staff" showFooter={false} showNav={false}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-indigo-500 text-white shadow-lg pb-6 pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold font-kanit flex items-center">
            <i className="fas fa-concierge-bell mr-3"></i>{" "}
            จัดการสิ่งอำนวยความสะดวก
          </h1>
          <button
            onClick={openAddModal}
            className="mt-2 sm:mt-0 bg-white text-indigo-600 px-4 py-1 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center"
          >
            <i className="fas fa-plus mr-1"></i> เพิ่มสิ่งอำนวยความสะดวก
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-h-[calc(101vh-120px)] overflow-y-auto bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 p-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <p className="text-gray-500 text-center py-10">
              กำลังโหลดข้อมูล...
            </p>
          ) : facilities.length === 0 ? (
            <p className="text-gray-600 text-center py-10">
              ยังไม่มีข้อมูลสิ่งอำนวยความสะดวก
            </p>
          ) : (
            facilities.map((property) => (
              <div
                key={property.property_id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100 mb-6"
              >
                <h2 className="text-xl font-semibold text-indigo-700 mb-4">
                  🏢 {property.property_name}
                </h2>
                {property.facilities.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-4">
                    ยังไม่มีข้อมูลสิ่งอำนวยความสะดวกในหอนี้
                  </p>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-indigo-100 text-indigo-700">
                        <th className="py-3 px-4 text-left">
                          <i className="fas fa-list mr-1"></i> ชื่อ
                        </th>
                        <th className="py-3 px-4 text-left">
                          <i className="fas fa-icons mr-1"></i> ไอคอน
                        </th>
                        <th className="py-3 px-4 text-center">
                          <i className="fas fa-cog mr-1"></i> จัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.facilities.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b hover:bg-indigo-50 transition-all"
                        >
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4 text-indigo-600 text-lg">
                            {item.icon.startsWith("fa-") ? (
                              <i className={`fas ${item.icon}`}></i>
                            ) : (
                              <span className="text-xl">{item.icon}</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => openEditModal(item)}
                              className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 mr-2"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => openDeleteModal(item)}
                              className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {showAddModal
                ? "เพิ่มสิ่งอำนวยความสะดวก"
                : "แก้ไขสิ่งอำนวยความสะดวก"}
            </h3>
            <form
              onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หอพัก
                </label>
                <select
                  value={form.property_id}
                  onChange={(e) => setForm({ ...form, property_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                >
                  <option value="">-- เลือกหอพัก --</option>
                  {propertiesList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ไอคอน
                </label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                >
                  <option value="">-- เลือกไอคอน --</option>

                  {/* 🏢 ระบบอาคาร */}
                  <optgroup label="🏢 ระบบอาคาร">
                    <option value="fa-elevator">🛗 ลิฟต์</option>
                    <option value="fa-door-open">🚪 ประตูอัตโนมัติ</option>
                    <option value="fa-bolt">⚡ ไฟฟ้า / ปลั๊กไฟ</option>
                    <option value="fa-water">💧 ตู้กดน้ำ</option>
                    <option value="fa-snowflake">❄️ แอร์ / ระบบปรับอากาศ</option>
                    <option value="fa-fan">🌀 พัดลม / เครื่องระบายอากาศ</option>
                    <option value="fa-fire-extinguisher">🧯 ระบบดับเพลิง</option>
                    <option value="fa-charging-station">🔌 จุดชาร์จรถยนต์ไฟฟ้า (EV)</option>
                  </optgroup>

                  {/* 🛡️ ความปลอดภัย */}
                  <optgroup label="🛡️ ความปลอดภัย">
                    <option value="fa-shield-alt">🛡️ รปภ. 24 ชม.</option>
                    <option value="fa-video">📹 กล้องวงจรปิด</option>
                    <option value="fa-lock">🔒 ระบบล็อก / คีย์การ์ด</option>
                    <option value="fa-key">🗝️ ห้องล็อกเกอร์ / Key</option>
                    <option value="fa-hands-helping">🤝 จุดบริการช่วยเหลือ</option>
                  </optgroup>

                  {/* 🌐 อินเทอร์เน็ต / สื่อสาร */}
                  <optgroup label="🌐 อินเทอร์เน็ต / สื่อสาร">
                    <option value="fa-wifi">📶 Wi-Fi</option>
                    <option value="fa-network-wired">📱 อินเทอร์เน็ตความเร็วสูง</option>
                    <option value="fa-train-subway">🚇 ใกล้สถานีรถไฟ / ขนส่ง</option>
                  </optgroup>

                  {/* 🍽️ บริการ / สิ่งอำนวยความสะดวก */}
                  <optgroup label="🍽️ บริการ / สิ่งอำนวยความสะดวก">
                    <option value="fa-concierge-bell">🔔 แผนกต้อนรับ</option>
                    <option value="fa-utensils">🍽️ ร้านอาหาร / ห้องอาหาร</option>
                    <option value="fa-coffee">☕ คาเฟ่ / เครื่องดื่ม</option>
                    <option value="fa-store">🏪 ร้านสะดวกซื้อ</option>
                    <option value="fa-broom">🧹 ทำความสะอาด / Cleaning</option>
                    <option value="fa-drumstick-bite">🍗 ห้องครัว / Kitchen</option>
                    <option value="fa-smoking">🚬 พื้นที่สูบบุหรี่</option>
                  </optgroup>

                  {/* 🧺 ซักรีด */}
                  <optgroup label="🧺 ซักรีด">
                    <option value="fa-soap">🧼 ห้องซักผ้า / ซักรีด</option>
                    <option value="fa-tint">🧺 เครื่องซักผ้า</option>
                  </optgroup>

                  {/* 🏋️ กิจกรรม / กีฬา */}
                  <optgroup label="🏋️ กิจกรรม / กีฬา">
                    <option value="fa-swimmer">🏊 สระว่ายน้ำ</option>
                    <option value="fa-dumbbell">🏋️ ฟิตเนส</option>
                    <option value="fa-volleyball-ball">🏐 สนามกีฬา / สนามกลางแจ้ง</option>
                    <option value="fa-table-tennis">🏓 โต๊ะปิงปอง / ห้องนันทนาการ</option>
                    <option value="fa-bicycle">🚲 จักรยาน / ลานจักรยาน</option>
                  </optgroup>

                  {/* 🏠 พื้นที่ภายใน */}
                  <optgroup label="🏠 พื้นที่ภายใน">
                    <option value="fa-bed">🛏️ ห้องพัก / ห้องนอน</option>
                    <option value="fa-couch">🛋️ ห้องนั่งเล่น / Lounge</option>
                    <option value="fa-shower">🚿 ห้องน้ำ / Shower</option>
                    <option value="fa-wine-glass">🍷 บาร์ / Lounge</option>
                    <option value="fa-archive">🧳 ห้องเก็บของ</option>
                    <option value="fa-chalkboard">📋 ห้องทำงาน / Co-working Space</option>
                  </optgroup>

                  {/* 🌳 ภายนอกอาคาร */}
                  <optgroup label="🌳 ภายนอกอาคาร">
                    <option value="fa-tree">🌳 สวน / Garden</option>
                    <option value="fa-car">🚗 ที่จอดรถ</option>
                    <option value="fa-shuttle-van">🚌 รถรับส่ง</option>
                    <option value="fa-dog">🐶 สัตว์เลี้ยง</option>
                  </optgroup>
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ยืนยันการลบ
            </h3>
            <p className="text-gray-700 mb-6">
              คุณต้องการลบ "{selectedFacility?.name}" หรือไม่?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageFacilities;

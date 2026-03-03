// src/pages/Maintenance.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

// Modal สำหรับเพิ่ม/แก้ไขคำร้องแจ้งซ่อม
const AddEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  isEdit = false,
  properties,
  rooms,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-kanit flex items-center">
              <i
                className={`fas ${
                  isEdit ? "fa-edit" : "fa-wrench"
                } mr-2 text-indigo-500`}
              ></i>
              {isEdit ? "แก้ไขคำร้องแจ้งซ่อม" : "แจ้งซ่อมใหม่"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อสังหาริมทรัพย์
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                value={
                  formData.property_id
                    ? properties.find(
                        (p) => p.property_id === formData.property_id
                      )?.property_name || ""
                    : ""
                }
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ห้องพัก
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                value={
                  formData.room_id
                    ? rooms.find((r) => r.room_id === formData.room_id)
                        ?.room_name || ""
                    : ""
                }
                disabled
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รายละเอียด
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="กรุณากรอกรายละเอียดปัญหาที่ต้องการแจ้งซ่อม..."
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <i
                className={`fas ${isEdit ? "fa-save" : "fa-paper-plane"} mr-2`}
              ></i>
              {isEdit ? "บันทึกการแก้ไข" : "ส่งคำร้อง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// Modal สำหรับดูรายละเอียดคำร้องแจ้งซ่อม
const DetailModal = ({ isOpen, onClose, request, properties, rooms }) => {
  if (!isOpen || !request) return null;

  const propertyName =
    properties.find((p) => p.property_id === request.property_id)
      ?.property_name ||
    request.property_name ||
    "";
  const roomName =
    rooms.find((r) => r.room_id === request.room_id)?.room_name ||
    request.room_name ||
    "";

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/30">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <i className="fas fa-info-circle mr-3 text-yellow-300"></i>{" "}
            รายละเอียดคำร้อง
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-200"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 bg-white rounded-b-3xl">
          {/* Property */}
          <div className="p-4 bg-purple-50 rounded-xl shadow-md flex items-center">
            <i className="fas fa-building text-purple-500 text-2xl mr-4"></i>
            <div>
              <p className="text-gray-500 text-sm">อสังหาริมทรัพย์</p>
              <p className="font-medium text-gray-800">{propertyName}</p>
            </div>
          </div>

          {/* Room */}
          <div className="p-4 bg-pink-50 rounded-xl shadow-md flex items-center">
            <i className="fas fa-door-open text-pink-500 text-2xl mr-4"></i>
            <div>
              <p className="text-gray-500 text-sm">ห้องพัก</p>
              <p className="font-medium text-gray-800">{roomName}</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-yellow-50 rounded-xl shadow-md">
            <p className="text-gray-500 text-sm mb-1">รายละเอียดปัญหา</p>
            <p className="text-gray-800 font-medium">{request.description}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl shadow-md">
              <p className="text-gray-500 text-sm">วันที่แจ้ง</p>
              <p className="text-gray-800 font-medium">
                {formatDate(request.created_at)}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl shadow-md">
              <p className="text-gray-500 text-sm">วันที่อัปเดตล่าสุด</p>
              <p className="text-gray-800 font-medium">
                {formatDate(request.updated_at)}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Modal สำหรับการแจ้งเตือน
const NotificationModal = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fa-check-circle text-green-500";
      case "error":
        return "fa-times-circle text-red-500";
      case "warning":
        return "fa-exclamation-circle text-yellow-500";
      case "info":
        return "fa-info-circle text-blue-500";
      default:
        return "fa-bell text-indigo-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 animate-scaleIn">
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <i className={`fas ${getIcon()} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const Maintenance = ({ role }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const openDetailModal = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const [formData, setFormData] = useState({
    maintenance_id: "",
    property_id: "",
    room_id: "",
    description: "",
    priority: "medium",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [requestsRes, propertiesRes, roomsRes] = await Promise.all([
          API.get("/maintenance/tenant"),
          API.get("/properties/tenant/properties"),
          API.get("/maintenance/tenant/rooms"),
        ]);

        setRequests(requestsRes.data);
        setProperties(propertiesRes.data);
        setRooms(roomsRes.data);
      } catch (err) {
        console.error(err);
        showNotificationModal(
          "error",
          "เกิดข้อผิดพลาด",
          "ไม่สามารถดึงข้อมูลได้"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showNotificationModal = (type, title, message) => {
    setNotificationType(type);
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotification(true);

    // ปิดอัตโนมัติหลัง 3 วินาที
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const formatDate = (date) => {
    if (!date) return "-"; // null, undefined, หรือ "" ก็จะได้ "-"
    return new Date(date).toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "รอดำเนินการ",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          icon: "fas fa-clock",
        };
      case "in_progress":
        return {
          text: "กำลังดำเนินการ",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          icon: "fas fa-tools",
        };
      case "completed":
        return {
          text: "เสร็จสิ้น",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: "fas fa-check-circle",
        };
      case "cancelled":
        return {
          text: "ยกเลิก",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: "fas fa-times-circle",
        };
      default:
        return {
          text: status,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: "fas fa-question-circle",
        };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        room_id: formData.room_id,
        description: formData.description,
      };
      await API.post("/maintenance", requestData);

      const requestsRes = await API.get("/maintenance/tenant");
      setRequests(requestsRes.data);

      setShowAddModal(false);
      resetForm();
      showNotificationModal("success", "สำเร็จ", "เพิ่มคำร้องแจ้งซ่อมสำเร็จ!");
    } catch (err) {
      console.error(err);
      showNotificationModal(
        "error",
        "เกิดข้อผิดพลาด",
        "ไม่สามารถเพิ่มคำร้องได้"
      );
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        description: formData.description,
        room_id: formData.room_id, // ส่งแค่ค่าห้องเดียว
      };

      await API.put(`/maintenance/${formData.maintenance_id}`, requestData);

      const requestsRes = await API.get("/maintenance/tenant");
      setRequests(requestsRes.data);

      setShowEditModal(false);
      resetForm();
      showNotificationModal("success", "สำเร็จ", "แก้ไขคำร้องแจ้งซ่อมสำเร็จ!");
    } catch (err) {
      console.error(err);
      showNotificationModal(
        "error",
        "เกิดข้อผิดพลาด",
        "ไม่สามารถแก้ไขคำร้องแจ้งซ่อมได้"
      );
    }
  };

  const handleCancelRequest = async (request) => {
    try {
      await API.put(`/maintenance/${request.maintenance_id}/cancel`); // เรียก API เพื่อเปลี่ยน status
      // อัปเดตรายการใน state เลย
      setRequests(
        requests.map((r) =>
          r.maintenance_id === request.maintenance_id
            ? { ...r, status: "cancelled" }
            : r
        )
      );
      showNotificationModal(
        "success",
        "สำเร็จ",
        "คำร้องแจ้งซ่อมถูกยกเลิกเรียบร้อยแล้ว"
      );
    } catch (err) {
      console.error(err);
      showNotificationModal(
        "error",
        "เกิดข้อผิดพลาด",
        "ไม่สามารถยกเลิกคำร้องได้"
      );
    }
  };

  const openAddModal = () => {
    if (properties.length > 0) {
      const firstProperty = properties[0];
      const firstRoom = rooms.find(
        (r) => r.property_id === firstProperty.property_id
      );

      setFormData({
        maintenance_id: "",
        property_id: firstProperty.property_id,
        room_id: firstRoom ? firstRoom.room_id : "",
        description: "",
        priority: "medium",
      });
    } else {
      resetForm();
    }
    setShowAddModal(true);
  };

  const openEditModal = (request) => {
    setFormData({
      maintenance_id: request.maintenance_id,
      property_id: request.property_id,
      room_id: request.room_id,
      description: request.description,
      priority: request.priority || "medium",
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      maintenance_id: "",
      property_ids: [],
      room_ids: [],
      description: "",
      priority: "medium",
    });
  };

  return (
    <Layout role={role} showFooter={false} showNav={false}>
      {/* Sticky Header with Gradient Background */}
      <div className="sticky top-0 z-10 bg-green-400 text-white shadow-lg pb-4 pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-kanit mb-1">
                แจ้งซ่อม
              </h1>
              <p className="text-indigo-100 text-sm">
                จัดการคำร้องขอซ่อมแซมของคุณ
              </p>
            </div>
            <button
              onClick={() => {
                openAddModal();
              }}
              className="mt-3 sm:mt-0 bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
            >
              <i className="fas fa-plus mr-2"></i>
              แจ้งซ่อมใหม่
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-green-50 p-4 md:p-6">
        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={`skeleton-item-${index}-${i}`}
                      className="flex items-center"
                    >
                      {" "}
                      {/* เพิ่มคีย์ที่ไม่ซ้ำกัน */}
                      <div className="h-4 w-4 bg-gray-200 rounded-full mr-3"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-indigo-500 mb-4">
              <i className="fas fa-tools text-5xl"></i>
            </div>
            <h3 className="text-xl font-bold font-kanit mb-2">
              ยังไม่มีรายการแจ้งซ่อม
            </h3>
            <p className="text-gray-600 mb-6 max-w-md text-center">
              คุณยังไม่ได้แจ้งซ่อมใดๆ คลิกปุ่มด้านบนเพื่อสร้างคำร้องแจ้งซ่อมใหม่
            </p>
            <button
              onClick={() => {
                openAddModal();
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> แจ้งซ่อมใหม่
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((r) => {
              const statusBadge = getStatusBadge(r.status);

              // แสดงชื่อหอ
              const getPropertyNames = (r) => {
                // ถ้า request มี property_name จาก backend
                return r.property_name || "";
              };

              // แสดงชื่อห้อง
              const getRoomNames = (r) => {
                return r.room_name || "";
              };

              return (
                <div
                  key={`${r.maintenance_id}-${r.created_at}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold font-kanit text-gray-800">
                          {getPropertyNames(r)}
                        </h2>
                        <p className="text-gray-600 text-sm flex items-center mt-1">
                          <i className="fas fa-map-marker-alt mr-2 text-indigo-500"></i>
                          {r.property_address}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`${statusBadge.bgColor} ${statusBadge.textColor} px-3 py-1 rounded-full text-xs font-medium flex items-center`}
                        >
                          <i className={`${statusBadge.icon} mr-1`}></i>
                          {statusBadge.text}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold font-kanit flex items-center mb-3">
                        <i className="fas fa-door-open mr-2 text-indigo-500"></i>
                        ข้อมูลห้องพัก
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                          <i className="fas fa-home text-indigo-500"></i>
                        </div>
                        <div>
                          <p className="font-medium">{getRoomNames(r)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <i className="fas fa-exclamation-triangle mr-2 text-indigo-500"></i>
                        รายละเอียดปัญหา
                      </h3>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700">{r.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">
                          วันที่แจ้ง
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(r.created_at)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">
                          วันที่อัปเดตล่าสุด
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(r.updated_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between mt-5">
                      <button
                        onClick={() => openDetailModal(r)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                      >
                        <i className="fas fa-info-circle mr-1"></i> ดูรายละเอียด
                      </button>
                      <div className="flex space-x-2">
                        {r.status === "pending" && (
                          <>
                            <button
                              onClick={() => openEditModal(r)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                            >
                              <i className="fas fa-edit mr-1"></i> แก้ไข
                            </button>
                            <button
                              onClick={() => handleCancelRequest(r)}
                              className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
                            >
                              <i className="fas fa-times-circle mr-1"></i>{" "}
                              ยกเลิก
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEditModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        formData={formData}
        onInputChange={handleInputChange}
        properties={properties}
        rooms={rooms}
      />
      <AddEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        formData={formData}
        onInputChange={handleInputChange}
        isEdit={true}
        properties={properties}
        rooms={rooms}
      />
      <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        request={selectedRequest}
        properties={properties}
        rooms={rooms}
      />
      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        type={notificationType}
        title={notificationTitle}
        message={notificationMessage}
      />
    </Layout>
  );
};

export default Maintenance;

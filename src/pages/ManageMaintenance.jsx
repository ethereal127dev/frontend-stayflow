// src/pages/managesMaintenance.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

// Improved Notification Modal Component
const NotificationModal = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fas fa-check-circle text-green-500";
      case "error":
        return "fas fa-times-circle text-red-500";
      case "warning":
        return "fas fa-exclamation-triangle text-yellow-500";
      case "info":
        return "fas fa-info-circle text-blue-500";
      default:
        return "fas fa-bell text-indigo-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 animate-scaleIn">
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <i className={`${getIcon()} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold font-kanit mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let badgeClass =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";

  switch (status) {
    case "pending":
      badgeClass += "bg-yellow-100 text-yellow-800";
      break;
    case "in_progress":
      badgeClass += "bg-blue-100 text-blue-800";
      break;
    case "completed":
      badgeClass += "bg-green-100 text-green-800";
      break;
    case "cancelled":
      badgeClass += "bg-red-100 text-red-800";
      break;
    default:
      badgeClass += "bg-gray-100 text-gray-800";
  }

  return (
    <span className={badgeClass}>
      {status === "pending" && "รอดำเนินการ"}
      {status === "in_progress" && "กำลังดำเนินการ"}
      {status === "completed" && "เสร็จสิ้น"}
      {status === "cancelled" && "ยกเลิก"}
    </span>
  );
};

// Modal for editing maintenance status
const EditStatusModal = ({
  isOpen,
  onClose,
  onSubmit,
  maintenance,
  currentStatus,
}) => {
  const [newStatus, setNewStatus] = useState(maintenance?.status || "pending");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-kanit flex items-center">
              <i className="fas fa-edit mr-2 text-indigo-500"></i>
              แก้ไขสถานะการซ่อม
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียดการซ่อม
            </label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-700">{maintenance?.description}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานะปัจจุบัน
            </label>
            <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {currentStatus === "pending" && "รอดำเนินการ"}
              {currentStatus === "in_progress" && "กำลังดำเนินการ"}
              {currentStatus === "completed" && "เสร็จสิ้น"}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลือกสถานะใหม่
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">รอดำเนินการ</option>
              <option value="in_progress">กำลังดำเนินการ</option>
              <option value="completed">เสร็จสิ้น</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={() => onSubmit(maintenance.id, newStatus)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal for viewing maintenance details
const ViewDetailsModal = ({ isOpen, onClose, maintenance }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-kanit flex items-center text-indigo-600">
              <i className="fas fa-info-circle mr-2"></i>
              รายละเอียดการซ่อม
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* ส่วนข้อมูลหลัก*/}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              รายละเอียดการซ่อม
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <p className="text-gray-700">{maintenance?.description}</p>
            </div>
          </div>

          {/* Grid layout สำหรับข้อมูลอื่นๆ*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/*อสังหาริมทรัพย์ */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <i className="fas fa-building mr-2 text-indigo-500"></i>
                อสังหาริมทรัพย์
              </h4>
              <p className="text-gray-600">{maintenance?.property_name}</p>
            </div>

            {/* ห้องพัก */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <i className="fas fa-bed mr-2 text-indigo-500"></i>
                ห้องพัก
              </h4>
              <p className="text-gray-600">{maintenance?.room_name}</p>
            </div>

            {/* วันที่แจ้ง */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <i className="far fa-calendar-alt mr-2 text-indigo-500"></i>
                วันที่แจ้ง
              </h4>
              <p className="text-gray-600">
                {new Date(maintenance?.created_at).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* แก้ไขล่าสุด */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <i className="fas fa-clock mr-2 text-indigo-500"></i>
                แก้ไขล่าสุด
              </h4>
              <p className="text-gray-600">
                {maintenance?.updated_at
                  ? new Date(maintenance.updated_at).toLocaleString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </p>
            </div>

            {/* สถานะปัจจุบัน  */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <i className="fas fa-tag mr-2 text-indigo-500"></i>
                สถานะปัจจุบัน
              </h4>
              <div className="mt-2">
                <StatusBadge status={maintenance?.status} />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagesMaintenance = ({ role }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ดึงข้อมูลคำร้องแจ้งซ่อมทั้งหมด
        const requestsRes = await API.get("/maintenance");
        setRequests(requestsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (maintenanceId, newStatus) => {
    try {
      await API.put(`/maintenance/status/${maintenanceId}`, {
        status: newStatus,
      });

      // อัพเดทข้อมูลหลังจากเปลี่ยนสถานะ
      const updatedRequests = requests.map((req) =>
        req.id === maintenanceId ? { ...req, status: newStatus } : req
      );
      setRequests(updatedRequests);

      setShowEditModal(false);

      // แสดงการแจ้งเตือนสวยๆหลังจากอัพเดท
      showNotification("success", "สำเร็จ", "อัพเดทสถานะการซ่อมเรียบร้อย");
    } catch (err) {
      console.error(err);
      showNotification("error", "เกิดข้อผิดพลาด", "ไม่สามารถอัพเดทสถานะได้");
    }
  };

  const showNotification = (type, title, message) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification({ isOpen: false, type: "", title: "", message: "" });
    }, 3000);
  };

  const filteredRequests = requests.filter((req) => {
    const normalize = (str) => str.toLowerCase().replace(/\s+/g, ""); // แปลงเป็นตัวเล็กและลบช่องว่างทั้งหมด
    const search = normalize(searchTerm);

    const matchesSearch =
      normalize(req.description).includes(search) ||
      normalize(req.room_name).includes(search) ||
      normalize(req.property_name).includes(search);

    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout role={role} showFooter={false} showNav={false}>
        <div className="flex-1 overflow-auto bg-green-400 p-4 md:p-6">
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
                      <div className="h-4 w-4 bg-gray-200 rounded-full mr-3"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role={role} showFooter={false} showNav={false}>
      {/* Sticky Header with Gradient Background */}
      <div className="sticky top-0 z-10 bg-green-400 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-kanit mb-1">
                จัดการการซ่อม
              </h1>
              <p className="text-indigo-100 text-sm">
                ตรวจสอบและอัพเดทสถานะการซ่อมของแต่ห้องในอสังหาริมทรัพย์ของคุณ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter Section */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4">
          {/* Search box */}
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาด้วยคำค้นหา..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>

          {/* Filter select */}
          <div className="w-full sm:w-64">
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="in_progress">กำลังดำเนินการ</option>
              <option value="completed">เสร็จสิ้น</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-green-50 p-4 md:p-6">
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-indigo-500 mb-4">
              <i className="fas fa-tools text-5xl"></i>
            </div>
            <h3 className="text-xl font-bold font-kanit mb-2">
              ไม่พบรายการการซ่อม
            </h3>
            <p className="text-gray-600 mb-6 max-w-md text-center">
              ไม่มีรายการการซ่อมที่ตรงกับเงื่อนไขการค้นหาของคุณ
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {[
                      { icon: "fa-file-alt", label: "รายละเอียด" },
                      { icon: "fa-building", label: "อสังหาริมทรัพย์" },
                      { icon: "fa-bed", label: "ห้องพัก" },
                      { icon: "fa-flag", label: "สถานะ" },
                      { icon: "fa-calendar-alt", label: "วันที่แจ้ง" },
                      { icon: "fa-history", label: "แก้ไขล่าสุด" },
                      { icon: "fa-cogs", label: "การดำเนินการ" },
                    ].map((item) => (
                      <th
                        key={item.label}
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-medium font-bold text-gray-800 uppercase tracking-wider border border-gray-200"
                      >
                        <div className="flex items-center">
                          <i
                            className={`fas ${item.icon} text-green-400 mr-2`}
                          ></i>
                          {item.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {filteredRequests.map((req, idx) => (
                    <tr
                      key={req.id || `maintenance-${idx}`}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 border border-gray-200 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
                        {req.description}
                      </td>
                      <td className="px-4 py-4 border border-gray-200 whitespace-nowrap text-sm text-gray-900">
                        {req.property_name}
                      </td>
                      <td className="px-4 py-4 border border-gray-200 whitespace-nowrap text-sm text-gray-900">
                        {req.room_name}
                      </td>
                      <td className="px-4 py-4 border border-gray-200 whitespace-nowrap">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-4 py-4 border border-gray-200 whitespace-nowrap text-sm text-gray-500">
                        {new Date(req.created_at).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-4 border border-gray-200 whitespace-nowrap text-sm text-gray-500">
                        {req.updated_at
                          ? new Date(req.updated_at).toLocaleDateString(
                              "th-TH",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-4 border border-gray-200 text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                          <button
                            onClick={() => {
                              setCurrentRequest(req);
                              setShowViewModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <i className="fas fa-eye mr-1"></i>
                            ดูรายละเอียด
                          </button>
                          <button
                            onClick={() => {
                              setCurrentRequest(req);
                              setShowEditModal(true);
                            }}
                            className={`${
                              req.status === "completed" ||
                              req.status === "cancelled"
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-indigo-600 hover:text-indigo-900 flex items-center"
                            }`}
                            disabled={
                              req.status === "completed" ||
                              req.status === "cancelled"
                            }
                          >
                            <i className="fas fa-edit mr-1"></i>
                            {req.status === "completed" ||
                            req.status === "cancelled"
                              ? "ไม่สามารถแก้ไขได้"
                              : "เปลี่ยนสถานะ"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Modals */}
      <EditStatusModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleStatusChange}
        maintenance={currentRequest}
        currentStatus={currentRequest?.status}
      />

      <ViewDetailsModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        maintenance={currentRequest}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </Layout>
  );
};

export default ManagesMaintenance;

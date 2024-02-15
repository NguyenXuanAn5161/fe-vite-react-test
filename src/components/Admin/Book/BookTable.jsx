import {
  Button,
  Col,
  Popconfirm,
  Row,
  Table,
  message,
  notification,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineExport,
  AiOutlineImport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { callDeleteUser, callFetchListBook } from "../../../services/api";
import UserModalCreate from "../User/UserModalCreate";
import UserModalUpdate from "../User/UserModalUpdate";
import UserExport from "../User/data/UserExport";
import UserImport from "../User/data/UserImport";
import BookViewDetail from "./BookViewDetal";
import InputSearch from "./InputSearch";

const BookTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  // const [sortQuery, setSortQuery] = useState("");
  const [sortQuery, setSortQuery] = useState(""); // default sort by updateAt mới nhất
  const [dataViewDetail, setDataViewDetail] = useState("");
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);
  const [openModalExport, setOpenModalExport] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState("");

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, filter, sortQuery]);

  // khi thay doi current va pageSize thi search died!
  const fetchUser = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }

    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await callFetchListBook(query);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }

    setIsLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    const res = await callDeleteUser(userId);
    if (res && res.data) {
      message.success("Xoá user thành công!");
      await fetchUser();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
    }
  };

  // sau này load động cột này
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            href={`book#${record._id}`}
            onClick={() => {
              setDataViewDetail(record);
              setOpenViewDetail(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "Cập nhật ngày",
      dataIndex: "updatedAt",
      render: (text, record, index) => {
        return (
          <span>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</span>
        );
      },
      sorter: true,
    },
    {
      title: "Thao tác",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa người dùng"}
              description={"Bạn có chắc chắn muốn xóa người dùng này?"}
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteUser(record._id)}
            >
              <span>
                <AiOutlineDelete
                  style={{ color: "red", cursor: "pointer", marginRight: 10 }}
                />
              </span>
            </Popconfirm>

            <CiEdit
              style={{ color: "#f57800", cursor: "pointer" }}
              onClick={() => {
                setDataUpdate(record);
                setOpenModalUpdate(true);
              }}
            />
          </>
        );
      },
    },
  ];

  const renderHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Bảng danh sách sách</span>
      <span style={{ display: "flex", gap: 15 }}>
        <Button
          icon={<AiOutlineExport />}
          type="primary"
          onClick={() => setOpenModalExport(true)}
        >
          Export
        </Button>
        <Button
          icon={<AiOutlineImport />}
          type="primary"
          onClick={() => setOpenModalImport(true)}
        >
          Import
        </Button>
        <Button
          icon={<AiOutlinePlus />}
          type="primary"
          onClick={() => setOpenModalCreate(true)}
        >
          Thêm mới
        </Button>
        <Button
          type="ghost"
          onClick={() => {
            setCurrent(1);
            setFilter("");
            setSortQuery("");
          }}
        >
          <AiOutlineReload />
        </Button>
      </span>
    </div>
  );

  const handleSearch = (query) => {
    setFilter(query);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
  };

  const title = [
    { label: "Tên sách", key: "mainText" },
    { label: "Tác giả", key: "author" },
    { label: "Thể loại", key: "category" },
  ];

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            columns={columns}
            dataSource={listUser}
            onChange={onChange}
            rowKey="_id"
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
              showTotal: (total, range) => {
                return (
                  <div>
                    {range[0]} - {range[1]} trên {total} dòng
                  </div>
                );
              },
            }}
          />
        </Col>
      </Row>

      <UserModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchUser={fetchUser}
      />

      <BookViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <UserImport
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        fetchUser={fetchUser}
      />

      <UserExport
        openModalExport={openModalExport}
        setOpenModalExport={setOpenModalExport}
        listUser={listUser}
      />

      <UserModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchUser={fetchUser}
      />
    </>
  );
};

export default BookTable;

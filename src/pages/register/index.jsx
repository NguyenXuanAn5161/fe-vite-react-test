import { Button, Divider, Form, Input } from "antd";

const RegisterPage = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <div className="register-page" style={{ padding: "5%" }}>
      <h3 style={{ textAlign: "center" }}>Đăng ký tài khoản</h3>
      <Divider />
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
          margin: "0 auto",
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="true"
      >
        <Form.Item
          label="Họ và tên"
          name="fullname"
          rules={[
            {
              required: true,
              message: "Họ và tên không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Email không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Mật khẩu không được để trống!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: "Số điện thoại không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;

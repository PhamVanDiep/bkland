export const VNPAY_RESPONSE_CODE = [
    {
        key: '00',
        value: 'Giao dịch thành công'
    },
    {
        key: '07',
        value: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).'
    },
    {
        key: '09',
        value: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.'
    },
    {
        key: '10',
        value: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần'
    },
    {
        key: '11',
        value: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.'
    },
    {
        key: '12',
        value: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.'
    },
    {
        key: '13',
        value: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.'
    },
    {
        key: '24',
        value: 'Giao dịch không thành công do: Khách hàng hủy giao dịch'
    },
    {
        key: '51',
        value: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.'
    },
    {
        key: '65',
        value: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.'
    },
    {
        key: '75',
        value: 'Ngân hàng thanh toán đang bảo trì.'
    },
    {
        key: '79',
        value: 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch'
    }
]
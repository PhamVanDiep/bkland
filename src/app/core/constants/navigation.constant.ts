export const ADMIN_NAV = [
    {
        label: 'Thống kê',
        icon: 'pi pi-th-large',
        routerLink: 'admin/dashboard'
    },
    {
        label: 'Quản lý bài viết',
        icon: 'pi pi-list',
        routerLink: 'admin/post',
        items: [
            {
                label: 'Bài viết bán/cho thuê',
                routerLink: 'admin/post/main'
            },
            {
                label: 'Bài viết cộng đồng',
                routerLink: 'admin/post/forum'
            },
            {
                label: 'Bài viết tin tức',
                routerLink: 'admin/post/info'
            }
        ]
    },
    {
        label: 'Quản lý tài khoản người dùng',
        icon: 'pi pi-user',
        routerLink: 'admin/manage-account'
    },
    {
        label: 'Quản lý báo cáo bài viết',
        icon: 'pi pi-exclamation-triangle',
        routerLink: 'admin/report'
    },
    {
        label: 'Quản lý giao dịch tài chính',
        icon: 'pi pi-chart-line',
        routerLink: 'admin/finance-transaction'
    },
    {
        label: 'Nhắn tin với người dùng',
        icon: 'pi pi-comments',
        routerLink: 'admin/chat'
    },
    {
        label: 'Quản lý thông tin hệ thống',
        icon: 'pi pi-info-circle',
        routerLink: 'admin/about'
    },
    {
        label: 'Quản lý cấu hình',
        icon: 'pi pi-cog',
        routerLink: 'admin/config'
    }
];

export const USER_NAV = [
    {
        label: 'Bài đăng quan tâm',
        icon: 'pi pi-heart-fill',
        routerLink: 'user/focus'
    },
    {
        label: 'Quản lý bài viết',
        icon: 'pi pi-list',
        routerLink: 'user/post',
        items: [
            {
                label: 'Bài viết bán/cho thuê',
                routerLink: 'user/post/main'
            },
            {
                label: 'Bài viết cộng đồng',
                routerLink: 'user/post/forum'
            }
        ]
    },
    {
        label: 'Quản lý tài chính',
        icon: 'pi pi-chart-line',
        routerLink: 'user/balance-fluctuation',
        items: [
            {
                label: 'Nạp tiền',
                routerLink: 'user/recharge'
            },
            {
                label: 'Lịch sử giao dịch',
                routerLink: 'user/balance-fluctuation'
            }
        ]
    },
    {
        label: 'Thông báo BĐ giá',
        icon: 'pi pi-bell',
        routerLink: 'user/price-fluctuation-notify'
    },
    {
        label: 'Nhắn tin',
        icon: 'pi pi-comments',
        routerLink: 'user/chat'
    },
    {
        label: 'Liên kết môi giới',
        icon: 'pi pi-users',
        routerLink: 'user/cooperate-agency'
    },
    {
        label: 'Quản lý tài khoản',
        icon: 'pi pi-user',
        routerLink: 'user/account-management'
    },
    {
        label: 'Quản lý cấu hình',
        icon: 'pi pi-cog',
        routerLink: 'user/config'
    }
];

export const ENTERPRISE_NAV = [
    {
        label: 'Quản lý bài viết',
        icon: 'pi pi-list',
        routerLink: 'user/post',
        items: [
            {
                label: 'Bài viết dự án',
                routerLink: 'user/post/info'
            },
            {
                label: 'Bài viết cộng đồng',
                routerLink: 'user/post/forum'
            }
        ]
    },
    {
        label: 'Quản lý tài chính',
        icon: 'pi pi-chart-line',
        routerLink: 'user/balance-fluctuation',
        items: [
            {
                label: 'Nạp tiền',
                routerLink: 'user/recharge'
            },
            {
                label: 'Lịch sử giao dịch',
                routerLink: 'user/balance-fluctuation'
            }
        ]
    },
    {
        label: 'Nhắn tin',
        icon: 'pi pi-comments',
        routerLink: 'user/message'
    },
    {
        label: 'Quản lý tài khoản',
        icon: 'pi pi-user',
        routerLink: 'user/account-management'
    },
    {
        label: 'Quản lý cấu hình',
        icon: 'pi pi-cog',
        routerLink: 'user/config'
    }
];

export const HEADER_NAV = [
    {
        label: "Mua bán",
        items: [
            {
                label: "Nhà đất",
                routerLink: '/mua-ban/nha-dat',
            },
            {
                label: "Chung cư",
                routerLink: '/mua-ban/chung-cu'
            },
            {
                label: "Đất nền",
                routerLink: '/mua-ban/dat-nen'
            }
        ]
    },
    {
        label: "Cho thuê",
        items: [
            {
                label: "Nhà đất",
                routerLink: '/cho-thue/nha-dat'
            },
            {
                label: "Chung cư",
                routerLink: '/cho-thue/chung-cu'
            }
        ]
    },
    {
        label: "Cộng đồng",
        routerLink: '/cong-dong'
    },
    {
        label: "Tiện ích",
        items: [
            {
                label: "Dự án",
                routerLink: '/tien-ich/du-an'
            },
            {
                label: "Tin tức",
                routerLink: '/tien-ich/tin-tuc'
            },
            {
                label: "Phong thủy",
                routerLink: '/tien-ich/phong-thuy'
            },
            {
                label: "Quy định",
                routerLink: '/tien-ich/quy-dinh'
            },
            {
                label: "Hướng dẫn",
                routerLink: "/tien-ich/huong-dan"
            }
        ]
    }
];
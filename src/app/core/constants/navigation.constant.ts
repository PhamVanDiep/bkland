import { PROJECT_ROUTE } from "./other.constant";

export const ADMIN_NAV = [
    {
        label: 'Thống kê',
        icon: 'pi pi-th-large',
        routerLink: 'admin/dashboard',
        items: [
            
            {
                label: 'Bài viết',
                routerLink: 'admin/dashboard/post'
            },
            {
                label: 'Giá bất động sản',
                routerLink: 'admin/dashboard/price'
            },
            {
                label: 'Người dùng và Tài chính',
                routerLink: 'admin/dashboard/user-balance'
            },
            {
                label: 'Dự án bất động sản',
                routerLink: 'admin/dashboard/project'
            }
        ]
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
            },
            {
                label: 'Dự án bất động sản',
                routerLink: 'admin/post/project'
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
        label: 'Thống kê',
        icon: 'pi pi-th-large',
        routerLink: 'user/dashboard',
    },
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
        routerLink: 'user/balance',
        items: [
            {
                label: 'Nạp tiền',
                routerLink: 'user/balance/recharge'
            },
            {
                label: 'Lịch sử giao dịch',
                routerLink: 'user/balance/fluctuation'
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
        label: 'Thống kê',
        icon: 'pi pi-th-large',
        routerLink: 'user/dashboard',
    },
    {
        label: 'Quản lý bài viết',
        icon: 'pi pi-list',
        routerLink: 'user/post',
        items: [
            {
                label: 'Dự án bất động sản',
                routerLink: 'user/post/project'
            },
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
        routerLink: 'user/balance',
        items: [
            {
                label: 'Nạp tiền',
                routerLink: 'user/balance/recharge'
            },
            {
                label: 'Lịch sử giao dịch',
                routerLink: 'user/balance/fluctuation'
            }
        ]
    },
    {
        label: 'Nhắn tin',
        icon: 'pi pi-comments',
        routerLink: 'user/chat'
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
        label: "Dự án",
        items: [
            {
                label: "Căn hộ chung cư",
                routerLink: `/du-an/${PROJECT_ROUTE.CAN_HO_CHUNG_CU}`
            },
            {
                label: "Cao ốc văn phòng",
                routerLink: `/du-an/${PROJECT_ROUTE.CAO_OC_VAN_PHONG}`
            },
            {
                label: "Trung tâm thương mại",
                routerLink: `/du-an/${PROJECT_ROUTE.TRUNG_TAM_THUONG_MAI}`
            },
            {
                label: "Khu đô thị mới",
                routerLink: `/du-an/${PROJECT_ROUTE.KHU_DO_THI_MOI}`
            },
            {
                label: "Khu phức hợp",
                routerLink: `/du-an/${PROJECT_ROUTE.KHU_PHUC_HOP}`
            },
            {
                label: "Nhà ở xã hội",
                routerLink: `/du-an/${PROJECT_ROUTE.NHA_O_XA_HOI}`
            },
            {
                label: "Khu nghỉ dưỡng, Sinh thái",
                routerLink: `/du-an/${PROJECT_ROUTE.KHU_NGHI_DUONG_SINH_THAI}`
            },
            {
                label: "Khu công nghiệp",
                routerLink: `/du-an/${PROJECT_ROUTE.KHU_CONG_NGHIEP}`
            },
            {
                label: "Biệt thự, liền kề",
                routerLink: `/du-an/${PROJECT_ROUTE.BIET_THU_LIEN_KE}`
            },
            {
                label: "Shop house",
                routerLink: `/du-an/${PROJECT_ROUTE.SHOP_HOUSE}`
            },
            {
                label: "Nhà mặt phố",
                routerLink: `/du-an/${PROJECT_ROUTE.NHA_MAT_PHO}`
            },
            {
                label: "Dự án khác",
                routerLink: `/du-an/${PROJECT_ROUTE.DU_AN_KHAC}`
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
                label: "Tin dự án",
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
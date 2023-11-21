export const PRODUCT_CATEGORIES = [
    {
        label:"UI Kits",
        value:"ui_kits" as const,
        featured:[
            {
                Name: "Editor picks",
                href:"#",
                imageSrc:"/nav/ui-kits/mixed.jpg"
            },
            {
                Name: "New Arrivals",
                href:"#",
                imageSrc:"/nav/ui-kits/blue.jpg"
            },
            {
                Name: "Bestsellers",
                href:"#",
                imageSrc:"/nav/ui-kits/purple.jpg"
            }
        ]
    },
    {
        label:"Icons",
        value:"icons" as const,
        featured:[
            {
                Name: "Favorite Icons Picks",
                href:"#",
                imageSrc:"/nav/icons/picks.jpg"
            },
            {
                Name: "New Arrivals",
                href:"#",
                imageSrc:"/nav/icons/new.jpg"
            },
            {
                Name: "Bestselling Icons",
                href:"#",
                imageSrc:"/nav/icons/bestsellers.jpg"
            }
        ]
    },
]
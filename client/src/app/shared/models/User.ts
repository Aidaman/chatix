export interface User {
    _id: string;
    token: string;
    name: string;
    isOnline: boolean;
    isPremium: boolean;
    socketId: string;
    avatar: string;
    colorTheme: string;
}


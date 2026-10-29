"use client";

import { useEffect } from "react";
import { userStateStore } from '@/lib/userStateStore';
import api from '@/lib/api';

export default function AppHome() {

    const userState = userStateStore();

    const initAuth = () => {

        api.post('/api/validation')
        .then((response) => {
            const res = response.data;
            if (res.result) {
                localStorage.setItem('accessToken', res.data.accessToken);
                userState.saveState(res.data.accountId, res.data.role, res.data.nickName);
            } else {
                userState.deleteInfo();
            }
        })
        .catch((error) => {
            //console.log(error);
        });
    }

    useEffect(() => {
        if (localStorage.getItem('accessToken') != null)
            initAuth();
    }, [])

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">

        </div>
    );
}
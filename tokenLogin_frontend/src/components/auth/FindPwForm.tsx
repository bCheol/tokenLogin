"use client";

import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { userStateStore } from '@/lib/userStateStore';
import { isNumber } from '@/lib/common';

export default function SignInForm() {
    const router = useRouter();
    const userState = userStateStore();
    const [accountId, setAccountId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const findPw = () => {

        if (accountId == '') {
            alert('아이디를 입력해주세요')
        }
        if (name == '') {
            alert('이름을 입력해주세요')
            return;
        }
        if (phone == '') {
            alert('전화번호를 입력해주세요')
            return;
        }
        if (!(phone.length == 11)) {
            alert('전화번호 입력값을 확인해주세요')
            return;
        }
        if (!isNumber(phone)) {
            alert('전화번호는 숫자로만 입력가능합니다');
            return;
        }

        axios.post('/api/find-pw',
            { accountId: accountId, name: name, phone: phone })
            .then((response) => {
                const res = response.data;
                if (res.result) {
                    alert('임시 비밀번호는 ' + res.data + ' 입니다\n로그인 후 변경해주세요');
                } else {
                    alert(res.message);
                }
            })
            .catch((error) => {
                //console.log(error);
            });
    }

    return (
        <div className="flex w-full flex-1 flex-col lg:w-1/2">
            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                <div>
                    <div className="mb-4 sm:mb-4">
                        <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
                            Find Password
                        </h1>
                    </div>
                    <div>
                        <div className="space-y-4">
                            <div>
                                <Input placeholder="아이디를 입력하세요" maxLength={11}
                                    value={accountId} onChange={(e) => setAccountId(e.target.value)} />
                            </div>
                            <div>
                                <Input placeholder="이름을 입력하세요" maxLength={10}
                                    value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <Input placeholder="전화번호를 입력해주세요 ex) 01012341234" maxLength={11}
                                    value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div>
                                <Button className="w-full" onClick={() => findPw()}>
                                    비밀번호 찾기
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
                            Already have an account?{" "}
                            <Link href="/signin" className="text-brand-500 hover:text-brand- 600 dark:text-brand-400" >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
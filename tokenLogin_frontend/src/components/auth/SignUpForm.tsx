"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Link from "next/link";
import Button from "../ui/button/Button";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { isNumber } from '@/lib/common';

export default function SignUpForm() {

  const router = useRouter();
  const [accountId, setAccountId] = useState('');
  const [isCheckId, setIsCheckId] = useState(false);
  const [password, setPassword] = useState('');
  const [nickName, setNickName] = useState('');
  const [isCheckNickName, setIsCheckNickName] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const checkId = () => {

    if (accountId == '') {
      alert('아이디를 입력해주세요');
      return;
    }

    axios.get('/api/exists-id',
    { 
      params: { accountId: accountId }
    })
    .then((response) => {
       const res = response.data;
      if (res.result) {
        setIsCheckId(true);
        alert(res.message);
      } else {
        alert(res.message);
      }
    })
    .catch((error) => {
      //console.log(error);
    });
  }

  const checkNickName = () => {

    if (nickName == '') {
      alert('닉네임을 입력해주세요');
      return;
    }

    axios.get('/api/exists-nickname',
    { 
      params: { nickName: nickName }
    })
    .then((response) => {
       const res = response.data;
      if (res.result) {
        setIsCheckNickName(true);
        alert(res.message);
      } else {
        alert(res.message);
      }
    })
    .catch((error) => {
      //console.log(error);
    });
  }

  const singup = () => {

    if (accountId == '') {
      alert('아이디를 입력해주세요');
      return;
    }
    if (password == '') {
      alert('비밀번호를 입력해주세요');
      return;
    }
    if (nickName == '') {
      alert('닉네임을 입력해주세요');
      return;
    }
    if (name == '') {
      alert('이름을 입력해주세요');
      return;
    }
    if (phone == '' || !(11 == phone.length)) {
      alert('전화번호를 입력해주세요');
      return;
    }
    if (!isNumber(phone)) {
      alert('전화번호는 숫자로만 입력가능합니다');
      return;
    }
    if (!isChecked) {
      alert('정책 동의가 필요합니다');
      return;
    }
    if (!isCheckId) {
      alert('아이디 중복 체크해주세요');
      return;
    }
    if (!isCheckNickName) {
      alert('닉네임 중복 체크해주세요');
      return;
    }

    axios.post('/api/signup',
    {
      accountId: accountId,
      password: password,
      nickName: nickName,
      name: name,
      phone: phone
    })
    .then((response) => {
       const res = response.data;
      if (res.result) {
        alert('가입되었습니다')
        router.push('/');
      } else {
        alert(res.message)
      }
    })
    .catch((error) => {
      //console.log(error);
    });
  }

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-4 sm:mb-4">
            <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <div className="space-y-4">
              <div>
                <Label>
                  아이디<span className="text-error-500">*</span>
                </Label>
                <div className="flex justify-between">
                  <Input placeholder="아이디를 입력해주세요" maxLength={15}
                  value={accountId} onChange={(e) => { setAccountId(e.target.value); setIsCheckId(false); } }
                    />
                  <Button size="sm" onClick={() => checkId()}>
                    중복확인
                  </Button>
                </div>
              </div>
              <div>
                <Label>
                  비밀번호<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input type="password" placeholder="비밀번호를 입력해주세요"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>
                  닉네임<span className="text-error-500">*</span>
                </Label>
                <div className="flex justify-between">
                  <Input placeholder="닉네임을 입력해주세요" maxLength={10}
                    value={nickName} onChange={(e) => { setNickName(e.target.value); setIsCheckNickName(false); } }
                  />
                  <Button size="sm" onClick={() => checkNickName()}>
                    중복확인
                  </Button>
                </div>
              </div>
              <div>
                <Label>
                  이름<span className="text-error-500">*</span>
                </Label>
                <Input placeholder="이름을 입력해주세요" maxLength={10}
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  전화번호<span className="text-error-500">*</span>
                </Label>
                <Input placeholder="전화번호를 입력해주세요 ex) 01012341234" maxLength={11}
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox className="h-5 w-5"
                  checked={isChecked} onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  By creating an account means you agree to the{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Terms and Conditions,
                  </span>{" "}
                  and our{" "}
                  <span className="text-gray-800 dark:text-white">
                    Privacy Policy
                  </span>
                </p>
              </div>
              <div>
                <button className="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                  onClick={() => singup()}>
                  Sign Up
                </button>
              </div>
              {/*
              <div>
                <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg" >
                    <path
                      d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Sign up with Google
                </button>
              </div>
              */}
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
    </div>
  );
}
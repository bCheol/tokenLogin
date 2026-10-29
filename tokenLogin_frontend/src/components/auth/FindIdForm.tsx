"use client";

import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { useState } from "react";
import axios from 'axios';
import { isNumber } from '@/lib/common';

export default function SignInForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const findId = () => {

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

    axios.get('/api/find-id',
      {
        params: { name: name, phone: phone }
      })
      .then((response) => {
        const res = response.data;
        if (res.result) {
          alert('회원 님의 아이디는 ' + res.data + ' 입니다');
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
              Find Id
            </h1>
          </div>
          <div>
            <div className="space-y-4">
              <div>
                <Input placeholder="이름을 입력하세요" maxLength={10}
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Input placeholder="전화번호를 입력해주세요 ex) 01012341234" maxLength={11}
                  value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Button className="w-full" onClick={() => findId()}>
                  아이디 찾기
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
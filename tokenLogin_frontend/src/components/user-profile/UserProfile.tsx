"use client";

import { PencilIcon } from "@/icons";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { useEffect, useState } from "react";
import { userStateStore } from '@/lib/userStateStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type InfoType = {
    role: string;
    nickName: string;
    name: string;
    phone: string;
};

export default function UserProfile() {

    const router = useRouter();
    const { isOpen: isEdit, openModal: editOpen, closeModal: editClose } = useModal();
    const { isOpen: isWithdraw, openModal: withdrawOpen, closeModal: withdrawClose } = useModal();
    const userState = userStateStore();
    const storeAccountId = userStateStore((s) => s.accountId);
    const [info, setInfo] = useState<InfoType[]>([]);
    const [password, setPassword] = useState('');
    const [nickName, setNickName] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const initProfile = () => {

        api.get('/api/account/profile',
            { params: { accountId: storeAccountId } }
        )
        .then((response) => {
            const res = response.data;
            if (res.result)
                setInfo([res.data]);
        })
        .catch((error) => {
            //console.log(error);
        });
    }

    const saveProfile = () => {

        api.post('/api/account/profile',
            {
                accountId: storeAccountId,
                password: password,
                nickName: nickName,
                name: name,
                phone: phone
            }
        )
        .then((response) => {
            const res = response.data;
            if (res.result) {
                setInfo([res.data]);
                userState.saveNickName(res.data.nickName);
                editClose();
                alert('변경이 완료됐습니다');
            } else {
                alert('변경에 실패했습니다');
            }
        })
        .catch((error) => {
            //console.log(error);
        });
    }

    const withdraw = () => {

        api.post('/api/account/withdraw',
            {
                accountId: storeAccountId,
                password: password
            }
        )
        .then((response) => {
            const res = response.data;
            if (res.result) {
                userState.deleteInfo();
                withdrawClose();
                alert('탈퇴가 완료됐습니다');
                router.push('/');
            } else {
                alert('탈퇴 실패했습니다');
            }
        })
        .catch((error) => {
            //console.log(error);
        });
    }       

    useEffect(() => {
        if (!storeAccountId)
            return;

        initProfile();
    }, [storeAccountId])

    return (
        <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
                <div className="flex items-center justify-between">
                    <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
                        Profile
                    </h3>
                    <Button size="sm" onClick={withdrawOpen}>
                        탈퇴
                    </Button>
                </div>
                <div className="mb-6 rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
                    <div className="flex flex-col gap-5 sm:flex-row xl:gap-10">
                        <div className="flex-1">
                            <div className="mb-4 flex flex-col gap-5 sm:flex-row lg:mb-6 xl:items-center xl:justify-between">
                                <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center lg:gap-6">
                                    <div className="overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
                                    </div>
                                    <div className="text-start">
                                        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                                            {info[0]?.nickName} 님
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="relative grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-11 xl:gap-y-7">
                                <div className="hidden xl:block"></div>
                                <div>
                                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                        회원 유형
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        {info[0]?.role == 'ROLE_USER' ? '일반 회원' : '관리자'}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                        이름
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        {info[0]?.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                        번호
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        {info[0]?.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={editOpen}
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
                            >
                                <PencilIcon className="size-5" />
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isEdit} onClose={editClose} className="m-4 max-w-[700px]">
                    <div className="relative no-scrollbar w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
                        <div className="px-2 pe-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                Edit Personal Information
                            </h4>
                            <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                                Update your details to keep your profile up-to-date.
                            </p>
                        </div>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="my-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                                    Personal Information
                                </h5>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2">
                                        <Label>비밀번호</Label>
                                        <Input type="password"
                                            placeholder="변경할 비밀번호를 입력해주세요" onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>닉네임</Label>
                                        <Input type="text" maxLength={10}
                                            placeholder={info[0]?.nickName} onChange={(e) => setNickName(e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>이름</Label>
                                        <Input type="text" maxLength={10}
                                            placeholder={info[0]?.name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>번호</Label>
                                        <Input type="text" maxLength={11}
                                            placeholder={info[0]?.phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={editClose}>
                                Close
                            </Button>
                            <Button size="sm" onClick={() => saveProfile()}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={isWithdraw} onClose={withdrawClose} className="m-4 max-w-[700px]">
                    <div className="relative no-scrollbar w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
                        <div className="px-2 pe-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                회원 탈퇴
                            </h4>
                            <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
                                탈퇴하면 같은 정보로 가입할 수 없습니다.
                            </p>
                        </div>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="my-7">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2">
                                        <Label>비밀번호</Label>
                                        <Input type="password"
                                            placeholder="비밀번호를 입력해주세요" onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={withdrawClose}>
                                Close
                            </Button>
                            <Button size="sm" onClick={() => withdraw()}>
                                탈퇴하기
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
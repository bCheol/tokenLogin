"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const userStateStore = create
  <{
    check: boolean;
    accountId: string;
    role: string;
    nickName: string;
    saveState: (accountId: string, role: string, nickName: string) => void;
    saveNickName: (nickname: string) => void;
    deleteInfo: () => void;
  }>()
  (
    persist(
      (set) => ({
        check: false,
        accountId: '',
        role: '',
        nickName: '',
        saveState: (accountId, role, nickName) => {
          set(
            {
              check: true,
              accountId: accountId,
              role: role,
              nickName: nickName
            })
        },
        saveNickName: (nickName) => {
          set(
            {
              nickName: nickName
            })
        },
        deleteInfo: () => {
          set({ check: false, accountId: '', role: '', nickName: '' });
          userStateStore.persist.clearStorage();
        }
      })
      , { name: 'userState' }
    )
  );
"use client";

import React, { useState } from "react";
import Header from "@/app/(components)/Header";
import { useDispatch, useSelector } from "react-redux";
import { setIsDarkMode } from "@/state"; // Adjust path based on your folder structure

type UserSetting = {
  label: string;
  value: string | boolean;
  type: "text" | "toggle";
};

const dummySettings: UserSetting[] = [
  { label: "Username", value: "first_name_123", type: "text" },
  { label: "Email", value: "firstname@example.com", type: "text" },
  { label: "Notification", value: true, type: "toggle" },
  { label: "Dark Mode", value: false, type: "toggle" },
  { label: "Language", value: "English", type: "text" },
];

const Settings = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.isDarkMode); // Access isDarkMode from Redux state
  const [userSettings, setUserSettings] = useState<UserSetting[]>(dummySettings);

  const handleToggleChange = (index: number) => {
    const settingsCopy = [...userSettings];
    const isDarkModeToggle = settingsCopy[index].label === "Dark Mode";

    // Update toggle value in local state
    settingsCopy[index].value = !settingsCopy[index].value as boolean;
    setUserSettings(settingsCopy);

    // Dispatch setIsDarkMode action for the "Dark Mode" toggle
    if (isDarkModeToggle) {
      dispatch(setIsDarkMode(settingsCopy[index].value as boolean));
    }
  };

  return (
    <div className={`w-full ${isDarkMode ? "dark-mode" : ""}`}>
      <Header name="User Settings" />
      <div className="overflow-x-auto mt-5 shadow-md rounded-lg">
        <table className="min-w-full bg-white dark-mode:bg-gray-900 dark-mode:text-white">
          <thead className="bg-gray-800 text-white dark-mode:bg-gray-700">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Setting
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {userSettings.map((setting, index) => (
              <tr
                className="hover:bg-blue-50 dark-mode:hover:bg-gray-700"
                key={setting.label}
              >
                <td className="py-2 px-4">{setting.label}</td>
                <td className="py-2 px-4">
                  {setting.type === "toggle" ? (
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setting.value as boolean}
                        onChange={() => handleToggleChange(index)}
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                        transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  ) : (
                    <input
                      type="text"
                      className="px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:border-blue-500"
                      value={setting.value as string}
                      onChange={(e) => {
                        const settingsCopy = [...userSettings];
                        settingsCopy[index].value = e.target.value;
                        setUserSettings(settingsCopy);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;

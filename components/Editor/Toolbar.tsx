"use client";
import React from "react";
import Image from "next/image";
import { Quill } from "react-quill";

export const modules = {
  toolbar: {
    container: "#toolbar",
  },
  clipboard: {
    matchVisual: false,
  },
};

export const options = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "align",
  "link",
  "image",
];

export const QuillToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats mx-[2.375em]">
      <div className="flex items-center">
        <Image
          src="/assets/Image/text.svg"
          alt="Text icon"
          width={35}
          height={35}
          className="bg-PrimaryColor p-2 rounded-md mr-3"
        />

        <div className="flex items-center gap-1 border-x border-border px-2 py-2">
          <button className="ql-bold mx-1" />
          <button className="ql-italic mx-1" />
          <button className="ql-underline mx-1" />
        </div>

        <div className="flex items-center gap-1 border-r border-border px-2 py-2">
          <button className="ql-align left" value="justify" />
          <button className="ql-align middle" value="center" />
          <button className="ql-align right" value="right" />
          <button className="ql-align normal" value="" />
        </div>
      </div>

      <div className="flex items-center gap-1 mr-1">
        <div className="border-r border-border pr-6 py-2">
          <button className="ql-link" />
        </div>
        <button className="ql-image" />
      </div>
    </span>
  </div>
);

export default QuillToolbar;

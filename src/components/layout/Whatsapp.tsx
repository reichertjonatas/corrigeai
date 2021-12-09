import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/dist/client/image";
import { IconWhatsapp } from "../icons";

// interface WhatsappProps {
//   title?: string;
//   description?: string;
// }

export default function Whatsapp() {
  const [showMenu, setShowMenu] = useState(false);

  function toggle() {
    setShowMenu((wasOpened) => !wasOpened);
  }

  return (
    <div>
      {showMenu && (
        <div className="whatsapp-widget">
          <div className="whatsapp-content">
            <div className="whatsapp-dev">
              <div className="whatsapp-image">
                <Image src={IconWhatsapp}></Image>
              </div>
            </div>
            <div className="whatsapp-owner">
              <div className="whatsapp-image">
                <Image src={IconWhatsapp}></Image>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="whatsapp" onClick={toggle}>
        <Image src={IconWhatsapp}></Image>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "../styles/main.css";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [profilePrivate, setProfilePrivate] = useState(false);

  return (
    <div className="page settings-page-container">
      <h1 className="settings-title">⚙️ Definições da Conta</h1>
      <p className="settings-subtitle">
        Gerencie as suas preferências e privacidade.
      </p>
      <section className="settings-section privacy-settings">
        <h2 className="section-title">Privacidade e Visibilidade</h2>

        <div className="setting-item switch-item">
          <label className="setting-label" htmlFor="private-profile">
            Tornar Perfil Privado
          </label>
          <p className="setting-description">
            Se ativado, apenas os seus amigos e administradores podem ver o seu
            perfil e deixar assinaturas.
          </p>
          <input
            type="checkbox"
            id="private-profile"
            checked={profilePrivate}
            onChange={() => setProfilePrivate(!profilePrivate)}
            className="privacy-toggle"
          />
        </div>

        <div className="setting-item switch-item">
          <label className="setting-label" htmlFor="signature-access">
            Permitir Assinaturas
          </label>
          <p className="setting-description">
            Permite que outros membros do anuário deixem mensagens no seu
            perfil.
          </p>
          <input
            type="checkbox"
            id="signature-access"
            checked={true} // Por defeito
            onChange={() => {}} // Lógica para desativar/ativar
            className="privacy-toggle"
          />
        </div>
      </section>
      <section className="settings-section general-settings">
        <h2 className="section-title">Geral</h2>

        <div className="setting-item switch-item">
          <label className="setting-label" htmlFor="notifications">
            Receber Notificações
          </label>
          <p className="setting-description">
            Receber alertas quando alguém deixa uma assinatura ou lhe envia um
            pedido de amizade.
          </p>
          <input
            type="checkbox"
            id="notifications"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="notifications-toggle"
          />
        </div>

        <div className="setting-item button-item">
          <h2 className="section-title">Conta</h2>
          <button className="btn-action logout-btn">Terminar Sessão</button>
          <button className="btn-action delete-btn">
            Eliminar Conta Permanentemente
          </button>
        </div>
      </section>
    </div>
  );
}

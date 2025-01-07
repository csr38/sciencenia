import { FundingRequest } from '../db/models/fundingRequest';
import { Scholarship } from 'db/models/scholarship';
import { Announcement } from 'db/models/announcement';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendNewAccountEmail = async (destinationEmails: string[]) => {

  const approvedEmails = ["pablo.bustos@uc.cl", "franco.anfossi@uc.cl", "apsanmartin@uc.cl", "tsbravo@uc.cl", "ficontreras1@uc.cl", "mariapia.vega.f@uc.cl", "tschwarzenberg@uc.cl", "ignaciomunoz@uc.cl", "crisms@uc.cl", "marmstrongleon@uc.cl", "sofialarrainv@uc.cl"];
  const validEmails = destinationEmails.filter(email => approvedEmails.includes(email));

  if (validEmails.length === 0) {
    console.log("No valid recipients. Spam avoided.");
    return { message: "No valid recipients. Spam avoided." };
  }

  console.log("Sending new account email to:", validEmails);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_APP_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        const message = {
            from: `Sciencenia <${process.env.GMAIL_APP_USER}>`,
            to: "no-reply@cenia.cl",
            bcc: validEmails.join(", "),
            subject: "Se ha creado una nueva cuenta en la plataforma Sciencenia",
            html: `
                <p>Estimado usuario,</p>
        
                <p>Nos complace informarte que se ha creado una nueva cuenta en la plataforma <strong><a href="https://www.cenia.cl" target="_blank">Sciencenia</a></strong> para ti.</p>
        
                <p><strong>Tus credenciales de acceso son:</strong></p>
                <ul>
                    <li><strong>Usuario:</strong> tu dirección de correo electrónico registrada</li>
                    <li><strong>Contraseña:</strong> los últimos 5 dígitos de tu RUT. (incluyendo el dígito verificador, pero sin el guion)</li>
                </ul>
        
                <p>Te recomendamos cambiar tu contraseña al iniciar sesión por primera vez para mantener la seguridad de tu cuenta.</p>
        
                <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
        
                <p>Atentamente,<br>El equipo de Cenia</p>
            `,
        };

        const info = await transporter.sendMail(message);
        
      return({
          message: "Email sent successfully",
          info: info.messageId,
          preview: nodemailer.getTestMessageUrl(info)
      });
        
    } catch (error) {
        console.error("Error sending email:", error);
        return({ message: "Failed to send email", error: error.message });
    }
};

export const sendRequestResponse = async (destinationEmail) => {

    if (!destinationEmail) {
        return({ message: "destinationEmail is required"});
    }

    const approvedEmails = ["pablo.bustos@uc.cl", "franco.anfossi@uc.cl", "apsanmartin@uc.cl", "tsbravo@uc.cl", "ficontreras1@uc.cl", "mariapia.vega.f@uc.cl", "tschwarzenberg@uc.cl", "ignaciomunoz@uc.cl", "crisms@uc.cl", "marmstrongleon@uc.cl", "sofialarrainv@uc.cl"];

    if (!approvedEmails.includes(destinationEmail)) {
        console.log("No valid recipients. Spam avoided.");
        return { message: "No valid recipients. Spam avoided." };
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_APP_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        const message = {
            from: `Sciencenia <${process.env.GMAIL_APP_USER}>`,
            to: destinationEmail,
            subject: "Actualización: Tu solicitud en Sciencenia ha sido respondida",
            html: `
                <p>Estimado usuario,</p>
        
                <p>Nos complace informarte que hemos procesado tu solicitud en la plataforma <strong><a href="https://www.cenia.cl" target="_blank">Sciencenia</a></strong>, y ya tienes una respuesta disponible.</p>
        
                <p>Para ver los detalles de la respuesta, por favor ingresa a tu cuenta en nuestra plataforma.<p>
                
                <p>Si tienes preguntas adicionales o necesitas más ayuda, no dudes en ponerte en contacto con nosotros.</p>
        
                <p>Atentamente,<br>El equipo de Cenia</p>
        
            `,
        };
        const info = await transporter.sendMail(message);
        
        return({
            message: "Email sent successfully",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        });
        
    } catch (error) {
        console.error("Error sending email:", error);
        return({ message: "Failed to send email", error: error.message });
    }
};

export const checkExecutivePendingItems = async (destinationEmails: string[]) => {
    try {
      const pendingRequests = await FundingRequest.findAll({
        where: { status: "Pendiente" },
      });
  
      const pendingScholarships = await Scholarship.findAll({
        where: { status: "Pendiente" },
      });
  
      pendingRequests.sort((a, b) => a.createdAt - b.createdAt);
      pendingScholarships.sort((a, b) => a.createdAt - b.createdAt);
  
      const oneWeekAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
  
      const shouldSendRequestEmail = pendingRequests.length > 3 || pendingRequests[0]?.createdAt < oneWeekAgo;
      const shouldSendScholarshipEmail = pendingScholarships.length > 3 || pendingScholarships[0]?.createdAt < oneWeekAgo;
  
      if (shouldSendRequestEmail || shouldSendScholarshipEmail) {
        await sendCombinedExecutiveEmail(
          destinationEmails,
          pendingRequests.length,
          pendingScholarships.length,
          shouldSendRequestEmail,
          shouldSendScholarshipEmail
        );
        return("Executive email sent.");
      }

      return("No executive email sent. Pending items are within limits.");

    } catch (error) {
      return `Error checking executive pending items: ${error.message}`;
    }
};

const sendCombinedExecutiveEmail = async (
  destinationEmails: string[],
  requestCount: number,
  scholarshipCount: number,
  includeRequests: boolean,
  includeScholarships: boolean
) => {

  const approvedEmails = ["pablo.bustos@uc.cl", "franco.anfossi@uc.cl", "apsanmartin@uc.cl", "tsbravo@uc.cl", "ficontreras1@uc.cl", "mariapia.vega.f@uc.cl", "tschwarzenberg@uc.cl", "ignaciomunoz@uc.cl", "crisms@uc.cl", "marmstrongleon@uc.cl", "sofialarrainv@uc.cl"];
  const validEmails = destinationEmails.filter(email => approvedEmails.includes(email));

  if (validEmails.length === 0) {
    console.log("No valid recipients. Spam avoided.");
    return { message: "No valid recipients. Spam avoided." };
  }

  console.log("Sending executive pending tasks email to:", validEmails);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_APP_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const requestDetails = includeRequests
      ? `<p><strong>Solicitudes pendientes:</strong> ${requestCount}</p>`
      : "";

    const scholarshipDetails = includeScholarships
      ? `<p><strong>Becas pendientes:</strong> ${scholarshipCount}</p>`
      : "";

    const message = {
      from: `Sciencenia <${process.env.GMAIL_APP_USER}>`,
      to: validEmails.join(", "),
      subject: "Alerta: Hay solicitudes y becas pendientes en la plataforma Sciencenia",
      html: `
        <p>Estimado/a ejecutivo/a,</p>
        
        <p>Le informamos que hay ítems pendientes en la plataforma <strong><a href="https://www.cenia.cl" target="_blank">Sciencenia</a></strong> que requieren su atención:</p>
        ${requestDetails}
        ${scholarshipDetails}
        
        <p>Por favor, inicie sesión en la plataforma para revisar los elementos pendientes y tomar las medidas necesarias.</p>
        
        <p>Si tiene alguna pregunta o necesita asistencia, no dude en ponerse en contacto con nosotros.</p>
        
        <p>Atentamente,<br>El equipo de Cenia</p>
      `,
    };

    const info = await transporter.sendMail(message);
    return {
      message: "Email sent successfully",
      info: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return { message: "Failed to send email", error: error.message };
  }
};

export const sendAnnouncementEmail = async (announcement: Announcement, destinationEmails: string[]) => {

  const approvedEmails = ["pablo.bustos@uc.cl", "franco.anfossi@uc.cl", "apsanmartin@uc.cl", "tsbravo@uc.cl", "ficontreras1@uc.cl", "mariapia.vega.f@uc.cl", "tschwarzenberg@uc.cl", "ignaciomunoz@uc.cl", "crisms@uc.cl", "marmstrongleon@uc.cl", "sofialarrainv@uc.cl"];
  const validEmails = destinationEmails.filter(email => approvedEmails.includes(email));

  if (validEmails.length === 0) {
    console.log("No valid recipients. Spam avoided.");
    return { message: "No valid recipients. Spam avoided." };
  }

  console.log("Sending announcement email to:", validEmails);

  try {    
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.GMAIL_APP_USER,
              pass: process.env.GMAIL_APP_PASSWORD
          }
      });

      const message = {
          from: `Sciencenia <${process.env.GMAIL_APP_USER}>`,
          to: "no-reply@cenia.cl",
          bcc: validEmails.join(", "),
          subject: `Nuevo anuncio en la plataforma Sciencenia: ${announcement.title}`,
          html: `
              <p>Estimado/a usuario/a,</p>
      
              <p>Le informamos que se ha publicado un nuevo anuncio en la plataforma <strong><a href="https://www.cenia.cl" target="_blank">Sciencenia</a></strong>:</p>
      
              <p><strong>Título:</strong> ${announcement.title}</p>
              <p><strong>Contenido:</strong> ${announcement.description}</p>
      
              <p>Este anuncio podría contener información interesante para usted. Si desea participar o postular, inicie sesión en la plataforma para obtener más detalles y completar el proceso.</p>
      
              <p>Si tiene alguna pregunta o necesita asistencia, no dude en ponerse en contacto con nosotros.</p>
      
              <p>Atentamente,<br>El equipo de Cenia</p>
          `,
      };

      const info = await transporter.sendMail(message);
      return({
          message: "Email sent successfully",
          info: info.messageId,
          preview: nodemailer.getTestMessageUrl(info)
      });
      
  } catch (error) {
      console.error("Error sending email:", error);
      return({ message: "Failed to send email", error: error.message });
  }
}

export default {
    sendNewAccountEmail,
    sendRequestResponse,
    checkExecutivePendingItems,
    sendAnnouncementEmail,
};
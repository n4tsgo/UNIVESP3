const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// ⚠️ Configure suas credenciais de email aqui (recomendo usar variáveis de ambiente)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});

exports.sendEmailOnNewRating = functions.firestore
  .document("restaurants/{restauranteId}/ratings/{ratingId}")
  .onCreate(async (snap, context) => {
    const { restauranteId } = context.params;
    const ratingData = snap.data();

    try {
      // 1. Obtem o documento do restaurante
      const restaurantDoc = await db.collection("restaurants").doc(restauranteId).get();

      if (!restaurantDoc.exists) {
        console.log("Restaurante não encontrado.");
        return;
      }

      const restaurant = restaurantDoc.data();
      const email = restaurant.email;

      if (!email) {
        console.log("Restaurante sem e-mail.");
        return;
      }

      // 2. Monta o conteúdo do e-mail
      const mailOptions = {
        from: functions.config().email.user,
        to: email,
        subject: "Nova avaliação recebida!",
        text: `Olá! Você recebeu uma nova avaliação de ${ratingData.author || 'um cliente'}.
        
Nota: ${ratingData.rating}/5
Comentário: ${ratingData.text || 'Sem comentário'}

Confira na plataforma para mais detalhes.`,
      };

      // 3. Envia o e-mail
      await transporter.sendMail(mailOptions);
      console.log("E-mail enviado para", email);

    } catch (error) {
      console.error("Erro ao enviar o e-mail:", error);
    }
  });

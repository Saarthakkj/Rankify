'use server';

import { Resend } from 'resend';

// Initialize Resend outside the server action to avoid re-initialization on every call.
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ayush <ayush.sharma74892@gmail.com>', // Replace with your verified from email address
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error: error }; // Return an error object
    }

    console.log("Resend Success:", data);
    return { success: true, data: data }; // Return a success object
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, error: "An unexpected error occurred." }; // Handle unexpected errors
  }
}

// Example usage in a component:
// import { sendEmail } from './actions'; // Adjust path as necessary

// async function MyComponent() {
//   const handleButtonClick = async () => {
//     const result = await sendEmail('delivered@resend.dev', 'Hello from Next.js Server Action', '<strong>Email sent from a Server Action!</strong>');

//     if (result.success) {
//       console.log('Email sent successfully:', result.data);
//       // Handle success (e.g., show a success message to the user)
//     } else {
//       console.error('Email sending failed:', result.error);
//       // Handle error (e.g., show an error message to the user)
//     }
//   };

//   return (
//     <button onClick={handleButtonClick}>Send Email</button>
//   );
// }

// export default MyComponent;
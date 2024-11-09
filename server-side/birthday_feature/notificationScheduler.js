import cron from 'node-cron';
import { sendEmail } from './emailService.js'; // Make sure the path is correct
import { getTodaysBirthdays } from './birthdayService.js'; // Make sure the path is correct

cron.schedule('1 0 * * *', async () => { // Runs every day at 12:01 AM
  console.log("Running scheduled birthday check...");
  try {
      const birthdayEmployees = await getTodaysBirthdays();
      console.log("Employees with birthdays today:", birthdayEmployees);

      if (birthdayEmployees.length > 0) {
          const names = birthdayEmployees.map(emp => emp.name).join(', ');
          const subject = "🎉 Happy Birthday!";
          const message = `Today is the birthday of: ${names}!`;

          birthdayEmployees.forEach(({ email }) => {
              sendEmail(email, subject, message);
              console.log(`Email sent to: ${email}`);
          });
      } else {
          console.log("No birthdays today.");
      }
  } catch (error) {
      console.error("Error during birthday check:", error);
  }
});


import con from '../utils/db.js';

const getTodaysBirthdays = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT name, email FROM employee 
            WHERE DATE(dob) = CURDATE()
        `;

        con.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

// Export the function
export { getTodaysBirthdays };

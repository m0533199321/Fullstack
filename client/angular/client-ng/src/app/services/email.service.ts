import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = `https://smartchef-api.onrender.com/api/Email/send`;

  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, body: string) {
    const payload = { to, subject, body };
    return this.http.post(this.apiUrl, payload);
  }

  buildRecipeEmailBody(path: string): string {
    return `
      <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <div style="background-color: #FFA500; padding: 10px 20px; border-radius: 8px 8px 0 0; color: white;">
          <h2 style="margin: 0;">הודעה ממערכת ניהול המתכונים</h2>
        </div>
        <div style="padding: 20px; background-color: white; border: 1px solid #eee; border-top: none;">
          <p style="font-size: 18px;">שלום מנהל המערכת smart-chef,</p>
          <p style="font-size: 16px;">המערכת שלחה לך מתכון חדש לעיונך כמנהל.</p>
          <p style="font-size: 16px;">באפשרותך לצפות בו באמצעות הלחיצה על הקישור הבא:</p>
          <p style="font-size: 16px;">
            <a href="${path}" style="color: #FFA500; font-weight: bold; text-decoration: none;">לחץ כאן לצפייה במתכון</a>
          </p>
          <p style="font-size: 16px;">אם אינך מזהה את הבקשה – אנא התעלם מהודעה זו.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 14px; color: gray;">ההודעה נשלחה אוטומטית מאפליקציית ניהול המתכונים - Smart Chef</p>
        </div>
      </div>
    `;
  }
}
export interface IMailRepository {
  sendMail(to: string, subject: string, body: string): Promise<void>;
}

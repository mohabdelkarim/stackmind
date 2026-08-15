export class HealthService {
  getHealth() {
    return { ok: true, service: "stackmind nestjs live" };
  }
}

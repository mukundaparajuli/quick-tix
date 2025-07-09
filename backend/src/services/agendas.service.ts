import db from "../config/db";

type Agenda = {
    time: string;
    activity: string;
}

export class AgendasService {
    async createAgenda(eventId: number, agendas: Agenda[]) {
        let createdAgendas = [];
        for (const agneda of agendas) {
            const createdAgenda = await db.agenda.create({
                data: {
                    time: agneda.time,
                    activity: agneda.activity,
                    eventId
                }
            })

            createdAgendas.push(createdAgenda);
        }
        return createdAgendas;
    }

    // update agendas
}

export const agendasService = new AgendasService();
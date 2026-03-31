import { IEventRepository } from "../../../../shared/domain/repositories/event_repository_interface";
import type { EventCsvRow } from "../../../../shared/utils/event_csv_export_mapper";

export class DownloadEventsCsvUsecase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(): Promise<EventCsvRow[]> {
    return this.eventRepository.findAllForCsvExport();
  }
}

import { EntityError } from "../../helpers/errors/domain_errors";
import { EvaluationAnswer } from "./evaluation_answer";

export interface EventEvaluationProps {
  id?: string;
  eventId: string;
  userId?: string | null;
  externalEmail?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  answers?: EvaluationAnswer[];
}

export class EventEvaluation {
  constructor(public props: EventEvaluationProps) {
    this.validateProps(props);
  }

  private validateProps(props: EventEvaluationProps) {
    if (!props.eventId || props.eventId.trim().length === 0) {
      throw new EntityError("Event ID is required");
    }

    if (!props.userId && !props.externalEmail) {
      throw new EntityError(
        "Either userId or externalEmail must be provided"
      );
    }

    if (props.userId && props.externalEmail) {
      throw new EntityError(
        "Cannot provide both userId and externalEmail"
      );
    }
  }

  get id(): string {
    return this.props.id as string;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  get userId(): string | null | undefined {
    return this.props.userId;
  }

  get externalEmail(): string | null | undefined {
    return this.props.externalEmail;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get answers(): EvaluationAnswer[] {
    return this.props.answers ?? [];
  }
}

import { EntityError } from "../../helpers/errors/domain_errors";

export interface EvaluationAnswerProps {
  id?: string;
  evaluationId: string;
  questionId: string;
  rating?: number | null;
  textAnswer?: string | null;
}

export class EvaluationAnswer {
  constructor(public props: EvaluationAnswerProps) {
    this.validateProps(props);
  }

  private validateProps(props: EvaluationAnswerProps) {
    if (!props.evaluationId || props.evaluationId.trim().length === 0) {
      throw new EntityError("Evaluation ID is required");
    }

    if (!props.questionId || props.questionId.trim().length === 0) {
      throw new EntityError("Question ID is required");
    }

    if (props.rating !== null && props.rating !== undefined) {
      if (!Number.isInteger(props.rating) || props.rating < 1 || props.rating > 5) {
        throw new EntityError("Rating must be an integer between 1 and 5");
      }
    }
  }

  get id(): string {
    return this.props.id as string;
  }

  get evaluationId(): string {
    return this.props.evaluationId;
  }

  get questionId(): string {
    return this.props.questionId;
  }

  get rating(): number | null | undefined {
    return this.props.rating;
  }

  get textAnswer(): string | null | undefined {
    return this.props.textAnswer;
  }
}

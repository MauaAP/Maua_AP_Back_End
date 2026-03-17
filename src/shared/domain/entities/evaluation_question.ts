import { EntityError } from "../../helpers/errors/domain_errors";
import { QUESTION_TYPE } from "../enums/question_type";

export interface EvaluationQuestionProps {
  id?: string;
  text: string;
  type: QUESTION_TYPE;
  isActive: boolean;
}

export class EvaluationQuestion {
  constructor(public props: EvaluationQuestionProps) {
    this.validateProps(props);
  }

  private validateProps(props: EvaluationQuestionProps) {
    if (!props.text || props.text.trim().length === 0) {
      throw new EntityError("Question text is required");
    }

    if (!Object.values(QUESTION_TYPE).includes(props.type)) {
      throw new EntityError("Invalid question type");
    }

    if (typeof props.isActive !== "boolean") {
      throw new EntityError("isActive must be a boolean");
    }
  }

  get id(): string {
    return this.props.id as string;
  }

  get text(): string {
    return this.props.text;
  }

  get type(): QUESTION_TYPE {
    return this.props.type;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  setText(text: string): void {
    if (!text || text.trim().length === 0) {
      throw new EntityError("Question text is required");
    }
    this.props.text = text;
  }

  setIsActive(isActive: boolean): void {
    this.props.isActive = isActive;
  }
}

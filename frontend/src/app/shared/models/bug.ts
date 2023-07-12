export class Bug {
  _id?: string;
  reportedBy!: string;
  summary!: string;
  link!: string;
  description!: string;
  reproductionFindings!: string;
  developmentFindings!: string;
  message!: string;
  resolved!: boolean;
  tags!: string[];
}

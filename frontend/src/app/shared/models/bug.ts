export class Bug {
  _id!: number;
  summary!: string;
  link!: string;
  imageUrl?: string;
  description!: string;
  reproductionFindings!: string;
  developmentFindings!: string;
  message!: string;
  resolved!: boolean;
}

export class Bug{
  [x: string]: any;
  _id!:object;
  summary!:string;
  link!:string;
  imageUrl?:string;
  description!:string;
  reproductionFindings!:string;
  developmentFindings!:string;
  message!:string;
  resolved!:boolean;
}

export class CreateReviewDto {
  show: {
    id: string;
    title: string;
    duration: string;
    theater: string;
    poster: string;
  };
  recommend: boolean;
  review: string;
}

export interface TestingNavigateParams {
  modalContent: JSX.Element;
  name: string;
}

export interface TestingNavigate extends TestingNavigateParams {
  routeName: string;
}

import { DragosPage } from './app.po';

describe('dragos App', function() {
  let page: DragosPage;

  beforeEach(() => {
    page = new DragosPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

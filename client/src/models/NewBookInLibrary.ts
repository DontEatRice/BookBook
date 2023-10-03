export class NewBookInLibrary {
    bookId!: string;
    amount!: number;

    constructor(bookId: string, amount: number) {
        this.bookId = bookId;
        this.amount = amount;
    }
}

export default NewBookInLibrary
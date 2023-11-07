import { z } from 'zod';
import { AuthorViewModelType } from './AuthorViewModel';
import { BookCategoryViewModelType } from './BookCategoryViewModel';
import { PublisherViewModelType } from './PublisherViewModel';

const ACCEPTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

const AddBook = z.object({
    ISBN: z.string().refine((value) => /^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/.test(value), 'Nieprawidłowy ISBN'),
    title: z.string().min(1, "To pole jest wymagane"),
    yearPublished: z.preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().positive("Liczba musi być dodatnia"))
        .refine((year) => year <= new Date().getFullYear(), "Rok wydania nie może być z przyszłości"),
    description: z.string().nullable(),
    language: z.string().min(1, "To pole jest wymagane"),
    pageCount: z.string().transform((value) => {
        console.log(value)
        if(value == '')
            return null;
        else{
            return parseInt(z.string().parse(value));
        }
    })
    .refine((value) => {
        if(value == null)
            return true;
        
        return (value > 0)
    }, "Wartość musi być większa niż 0"),
    coverPictureUrl: z.string().url().optional().nullable(),
    idPublisher: z.custom<PublisherViewModelType>()
        .refine((publisher) => publisher != null, "To pole jest wymagane")
        .transform(publisher => publisher.id),
    categoriesIds: z.custom<BookCategoryViewModelType>()
        .array()
        .transform(categories => categories.map(category => category.id))
        .refine(ids => ids.length > 0, "Książka musi mieć co najmniej jedną kategorię"),
    authorsIds: z.custom<AuthorViewModelType>()
        .array()
        .transform(authors => authors.map(author => author.id))
        .refine(ids => ids.length > 0, "Książka musi mieć co najmniej jednego autora"),
    coverPicture: z
        .custom<FileList>((v) => v == undefined || v instanceof FileList)
        .optional()
        .transform((val) => val?.item(0))
        .refine((file) => file == undefined || file.size <= 1_000_000, {
          message: 'Plik musi być mniejszy niż 1 MB.',
        })
        .refine(
          (file) => file == undefined || ACCEPTED_FORMATS.includes(file.type),
          'Akceptowane pliki to .png i .jpg'
        ),

});

export default AddBook;
export type AddBookType = z.infer<typeof AddBook>;

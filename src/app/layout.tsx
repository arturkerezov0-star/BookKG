import "./style.css";
export const metadata={title:"BookKG — книги Бишкека",description:"Найди книгу в книжных магазинах Бишкека."};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
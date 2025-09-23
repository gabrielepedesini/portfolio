import parse from "html-react-parser";

export default function Description({ paragraphs }: { paragraphs: string[] }) {
    return (
        <>
            {paragraphs.map((p, i) => (
                <p key={i}>{parse(p)}</p>
            ))}
        </>
    );
}
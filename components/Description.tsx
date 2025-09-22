export default function Description({ paragraphs }: { paragraphs: string[] }) {
    return (
        <>
            {paragraphs.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} /> )}
        </>
    );
}
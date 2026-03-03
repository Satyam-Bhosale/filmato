import { Button, type ButtonProps } from "@react-email/components";


function FilmatoButton({ children, ...props }: ButtonProps) {
    return (
        <Button
            className="bg-[#ffcf00ff] text-[#26144ff] text-sm px-5 py-1 rounded-2xl cursor-pointer"
            {...props}
        >
            <p><strong className="text-[#26144ff]">{children}</strong></p>
        </Button>
    )
}

export default FilmatoButton
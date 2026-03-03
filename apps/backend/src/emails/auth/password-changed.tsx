import { toTitleCase } from "@filmato/utils";
import { Body, Container, Heading, Img, Preview, Section, Text } from "@react-email/components";
import FilmatoButton from "../components/button.js";
import BaseLayout from "../layouts/base-layout.js";

type Props = {
    username: string,
    email: string,
    resetUrl: string
}

function PasswordChanged({ username, email, resetUrl }: Props) {
        const name = toTitleCase(username);
    return (
        <BaseLayout>
            <Body>
                <Preview>Your Filmato password was changed</Preview>
                <Container className="mx-auto my-12.5 max-w-116.5 px-8 border border-solid border-[#ededed] rounded-xl">
                    <Section className="py-5">
                        <Img
                            height={30}
                            className="object-cover"
                            src="https://cdn.filmato.satyambhosale.com/logos/wordmark.png"
                        />
                    </Section>
                    <Section>
                        <Heading as="h2" className="py-0">
                            {
                                `Hey ${name}, your Filmato password was changed.`
                            }
                        </Heading>
                        <Section className="py-0 mx-auto max-w-full w-fit">
                            <Img
                                height={200}
                                className="object-cover"
                                src="https://cdn.filmato.satyambhosale.com/illustrations/reset-password.png"
                            />
                        </Section>
                        <Text>
                            This change was made for: <strong>{email}</strong>
                        </Text>
                        <Text>
                            If you didn’t make this change, reset your password immediately.
                        </Text>
                    </Section>
                    <Section className="pt-5 pb-10">
                        <FilmatoButton href={resetUrl}>
                            Reset Password
                        </FilmatoButton>
                    </Section>
                </Container>
            </Body>
        </BaseLayout>
    )
}

export default PasswordChanged;
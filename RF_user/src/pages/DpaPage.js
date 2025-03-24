import { Typography, Container, Stack } from '@mui/material';

const Sentence1 = [
  {
    id: 1,
    sentence1:
      'Affiliate: Any entity that directly or indirectly controls, is controlled by, or is under common control with, the subject entity, where control is the direct or indirect ownership or control of at least a majority of the voting rights, or otherwise the power to direct the management and policies, of the entity. An entity is an Affiliate only so long as such control continues.',
  },
  {
    id: 2,
    sentence1:
      'CCPA: The California Consumer Privacy Act of 2018, and the regulations promulgated thereunder, as it/they may be amended from time to time.',
  },
  {
    id: 3,
    sentence1:
      'Data Protection Law(s): Any data privacy, data security, and data protection law, directive, regulation, order, or rule, including without limitation the CCPA, the California Privacy Rights Act of 2020 (“CPRA”), and the Virginia Consumer Data Protection Act (“CDPA”). Nothing herein concedes the applicability of any Data Protection Law to Customer, the Services, or a particular consumer or data subject.',
  },
  {
    id: 4,
    sentence1:
      'Personal Information: Information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular natural person, household, or device linked to same, wherever located. For purposes of this DPA, Personal Information includes such data submitted by or on behalf of Customer, its Affiliates, or its/their customers related to the Services; or otherwise processed, collected, created, or accessed by Company as a result of the Services.',
  },
];

const Sentence2 = [
  {
    id: 1,
    sentence2:
      'General: Company shall not collect, retain, use, or disclose the Personal Information (and has not collected, retained, used, or disclosed the Personal Information) for any purpose other than to perform the Services pursuant to the Agreement, except, where a Data Protection Law applies to particular Personal Information, where and only to the extent permitted or required by that Data Protection Law.',
  },
  {
    id: 2,
    sentence2:
      'Specific Restrictions: Without limiting the generality of the foregoing, and for the avoidance of any doubt, Company shall not collect, retain, use, or disclose the Personal Information for a commercial purpose (other than providing the Services); sell the Personal Information; collect, retain, use, or disclose the Personal Information outside the direct business relationship between Company and Customer; collect more than the minimum Personal Information necessary, nor retain the Personal Information longer than necessary, to perform the Services; use the Personal Information to build or modify a profile about a natural person to use in providing services to an entity other than Customer; and correct or augment the Personal Information nor otherwise combine it with Personal Information from another source (including from Company itself). This DPA does not authorize processing of Personal Information for “targeted advertising” or “cross-context behavioral advertising” (as defined respectively by the CDPA and CPRA).',
  },
];

const Sentence3 = [
  {
    id: 1,
    sentence3:
      'General: Company shall reasonably cooperate with Customer as necessary for Customer to fulfill its responsibilities pursuant to applicable Data Protection Laws with respect to the Agreement. If in Customer’s discretion, applicable Data Protection Law is (or becomes) inconsistent with this DPA, Company shall negotiate in good faith regarding amendments proposed by Customer.',
  },
  {
    id: 2,
    sentence3:
      'Specific Requests: Without limiting the foregoing, as Customer may direct, Company shall promptly: provide Customer copies of any or all of the Personal Information in a structured, commonly used, machine-readable format easily rendered into text an average consumer/data subject can read and understand; correct any or all Personal Information; delete any or all Personal Information (pursuant to Section 2.4 (Disposal/Deletion)); assist Customer as it reasonably requests in addressing requests by consumers/data subjects (or their agents), including without limitation requests to “know;” to “delete,” to “opt out,” or to not “opt in”; and assist Customer as it reasonably requests to facilitate its compliance with applicable Data Protection Laws, including without limitation through Company cooperation with audits and data protection assessments. For the avoidance of doubt, Company shall not respond to requests from consumers/data subjects (or their agents) as to Personal Information, except where and to the extent applicable Data Protection Law requires a response directly from Company. Neither the Agreement nor this DPA authorizes or permits Company, on Customer’s behalf, to respond to requests from consumers/data subjects (or their agents), or other third parties unless the parties agree otherwise in a writing signed by both parties.',
  },
];

const Sentence4 = [
  {
    id: 1,
    sentence4:
      'Safeguards: Company shall maintain reasonable technical, physical, and administrative safeguards (including without limitation policies, procedures, staffing, and contractual provisions) to protect the Personal Information from unauthorized access, destruction, use, modification, or disclosure. Company shall protect the Personal Information with at least the same degree of care it uses to protect data and information of similar nature and importance but not less than reasonable care. Company shall protect the security, confidentiality, and integrity of the Personal Information by: securely storing and transporting Personal Information; securely disposing of and deleting Personal Information when no longer needed for the Services or as required by Section 2.4 (Disposal/Deletion), so as to render the information unreadable and irretrievable (including without limitation from electronic media); and requiring that any employee or sub-processor with access to Personal Information is subject to a written agreement with confidentiality and security obligations consistent with those imposed on Company by this DPA, including without limitation those of Subsection 2.5(b) (Incident Notification and Management).',
  },
  {
    id: 2,
    sentence4:
      'Incident Notification and Management: Company shall notify Customer promptly of any unauthorized access to or destruction, use, modification, or disclosure of any Personal Information (any “Security Incident”). This notification shall include: a description of the Security Incident; the categories and types of Personal Information affected; if applicable, the categories and number of records, and natural persons, whose Personal Information was affected; and such other information as may be required by applicable Data Protection Law or useful to address the Security Incident. Company shall also promptly investigate and remedy the Security Incident, take commercially reasonable steps to mitigate the effects of the Security Incident and to prevent further such incidents, cooperate with Customer and law enforcement with respect to the Security Incident, and take any other actions required of Company by applicable law. This Subsection 2.5(b) does not limit Customer’s other rights or remedies resulting from a Security Incident.',
  },
];

const Sentence5 = [
  {
    id: 1,
    symbol5: 'a.',
    sentence5:
      'Additional Restrictions. For the avoidance of doubt: Company shall provide privacy protections no less than required by applicable Data Protection Laws and shall comply with such laws; Company is Customer’s service provider and processor for the Personal Information, which is provided to Company for a business purpose; Customer does not sell Personal Information to Company in connection with this DPA or the Agreement; Company has not given Customer any reason to believe Company could not comply with this DPA; without limiting its obligations elsewhere in this DPA, Company shall promptly notify Customer if Company determines it can no longer meet its obligations under this DPA; Customer may audit Company’s use and management of Personal Information and/or Non-PI at any time, upon 5 business days’ notice, and Company shall comply with such audit; Company’s compliance with this DPA is at its own expense; and nothing in this DPA limits Customer’s rights or remedies under applicable law or the Agreement.',
  },
  {
    id: 2,
    symbol5: 'b.',
    sentence5:
      'Construction. Except as modified by this DPA, the Agreement will remain in full force and effect. This DPA’s terms prevail in the event of conflict between them and the Agreement or any documents attached to, linked to, or referenced in the Agreement. This DPA may be modified solely in writing signed by both parties.',
  },
  {
    id: 3,
    symbol5: 'c.',
    sentence5:
      'Certification. Company certifies that it understands its obligations pursuant to this DPA and shall comply with them.',
  },
];

export default function DpaPage() {
  return (
    <Container
      sx={{
        pt: { md: 8, sm: 2 },
        pb: { xs: 20, md: 30, lg: 30 },
        display: { md: 'flex' },
        height: { md: 'auto' },
      }}
    >
      <Stack sx={{ px: { lg: 10, md: 6, xs: 3 } }}>
        <Typography
          sx={{
            fontSize: { md: '36px', sm: '30px', xs: '24px' },
            fontWeight: '800',
            lineHeight: 1.2,
            pb: { md: 4, sm: 3, xs: 2 },
          }}
        >
          Data Processing Agreement
        </Typography>
        <Stack textAlign="justify" color="#000000">
          <Typography
            sx={{
              fontSize: { md: '16px', sm: '14px', xs: '12px' },
            }}
          >
            This Data Processing Agreement (“DPA”) forms part of the License Agreement (the
            “Agreement”) between Reality Fence, LLC (“Company”) and (“Customer”), governing certain
            products and/or services provided by Company (collectively, the “Services”). This DPA
            becomes part of the Agreement upon execution by both parties and is incorporated into
            the Agreement by reference.
          </Typography>
          <Stack sx={{ pt: { md: '16px', xs: '12px' } }}>
            <Typography
              sx={{
                fontSize: { md: '16px', sm: '14px', xs: '12px' },
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              I. DEFINITIONS
            </Typography>

            <Typography
              sx={{
                fontSize: { md: '16px', sm: '14px', xs: '12px' },
                color: 'black',
              }}
            >
              a. Terms Defined Here.
            </Typography>
            {Sentence1.map((item) => (
              <Typography
                key={item.id}
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  pl: 3,
                  color: 'black',
                }}
              >
                <li>{item.sentence1}</li>
              </Typography>
            ))}
            <Stack display="flex" flexDirection="row" gap="4px">
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                b.
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                Terms in Data Protection Laws. Terms defined in this DPA, or if not defined in the
                DPA then as defined in the Agreement, or for which definitions in Data Protection
                Laws are incorporated by reference, will, to the greatest extent consistent with
                their meanings, apply to terms of similar effect in Data Protection Laws that apply
                to natural persons governed by such laws (including without limitation, “data
                subjects,” “personal data,” “personal information,” “nonpublic personal
                information,” and “personally identifiable information”). As used in this DPA, the
                following terms have the meanings given them by the CCPA: “business,” “business
                purpose,” “commercial purpose,” “consumer,” “personal information,” “process,”
                “sell,” and “service provider;” provided this DPA governs Personal information of
                all natural persons, wherever located, and not just of Californians.
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: { md: '16px', sm: '14px', xs: '12px' },
                color: 'black',
                fontWeight: 'bold',
                mt: 3,
              }}
            >
              II. PROVIDER RESPONSIBILITIES.
            </Typography>
            <Typography
              sx={{
                fontSize: { md: '16px', sm: '14px', xs: '12px' },
                color: 'black',
              }}
            >
              a. Purpose and Use Restrictions.
            </Typography>

            {Sentence2.map((item) => (
              <Typography
                key={item.id}
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                  pl: 3,
                }}
              >
                <li>{item.sentence2}</li>
              </Typography>
            ))}

            <Stack display="flex" flexDirection="row" gap="4px">
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                b.
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                Legal Obligations. Company shall comply with: any and all legal obligations
                applicable to it as Customer&apos;s service provider, data processor, or entity with
                similar status under applicable Data Protection Laws, and Company shall make no
                effort to alter any such status without Customer&apos;s consent; and any and all
                legal obligations otherwise imposed on Company by applicable Data Protection Laws.
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: { md: '16px', sm: '14px', xs: '12px' },
                color: 'black',
              }}
            >
              c. Cooperation
            </Typography>

            {Sentence3.map((item) => (
              <Typography
                key={item.id}
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                  pl: 3,
                }}
              >
                <li>{item.sentence3}</li>
              </Typography>
            ))}

            <Stack display="flex" flexDirection="row" gap="4px">
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                d.
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                Disposal/Deletion. Upon the expiration or other termination of the Agreement or
                Customer&apos;s request, Company shall: return the Personal Information to Customer
                and then dispose of and delete all Personal Information in Company&apos;s possession
                or control, including without limitation the control of its employees or agents
                (pursuant to Section 2.5(a) (Safeguards) below); and provide Customer written
                certification of such disposal and deletion. Company&apos;s obligations pursuant to
                the Agreement and this DPA will continue until all disposal and deletion required
                above in this Section 2.4.
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: { md: '16px', sm: '14px', xs: '12px' },
                color: 'black',
              }}
            >
              e. Security
            </Typography>

            {Sentence4.map((item) => (
              <Typography
                key={item.id}
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                  pl: 3,
                }}
              >
                <li>{item.sentence4}</li>
              </Typography>
            ))}

            <Stack display="flex" flexDirection="row" gap="4px">
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                f.
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                Non-Personal Information. Neither this Section 2.6 (Non-Personal Information) nor
                this DPA authorizes processing of de-identified information or aggregate consumer
                data, as those terms are defined in applicable Data Protection Laws (“Non-PI”). If
                Company processes Non-PI, Company shall: take reasonable precautions to ensure that
                Non-PI cannot be associated with a natural person, household, or device linked to
                same, including without limitation by implementing technical safeguards that
                prohibit reidentification of Non-PI, implementing business processes that
                specifically prohibit reidentification of Non-PI, and implementing business
                processes to prevent inadvertent release of Non-PI; publicly commit to maintain and
                use Non-PI only in deidentified form, and make no attempt to reidentify Non-PI;
                permit and facilitate reasonable Customer oversight of Company&apos;s compliance
                with this Section 2.6; and process Non-PI only if, to the extent, and for the
                purposes permitted by then-applicable Data Protection Law and the Agreement (if
                any).
              </Typography>
            </Stack>

            <Stack display="flex" flexDirection="row" gap="4px">
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                g.
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                Sub-Processors. This DPA does not authorize Company to use sub-processors. If
                Company uses sub-processors, it shall notify Customer in advance and execute a
                written agreement with each sub-processor imposing obligations no less protective of
                the Personal Information than those this DPA imposes on Company.
              </Typography>
            </Stack>
            <Stack display="flex" flexDirection="row" gap="4px">
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                h.
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: '16px', sm: '14px', xs: '12px' },
                  color: 'black',
                }}
              >
                Location Services. If the Services provided by Company include the use of location
                services, Company shall: only collect, retain, use, or disclose location data as
                necessary to provide the Services and in accordance with Customer&apos;s
                instructions; notify Customer if location data will be shared with any third party
                and ensure that any such sharing complies with applicable Data Protection Laws;
                implement appropriate safeguards to protect location data from unauthorized access,
                use, or disclosure; and ensure that individuals have the ability to control and
                manage their location data, including opting in or out of location tracking, and
                accessing, correcting, or deleting their location data as required by applicable
                Data Protection Laws.
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: { md: '16px', sm: '14px', xs: '12px' },
                color: 'black',
                fontWeight: 'bold',
                mt: 3,
              }}
            >
              III. GENERAL.
            </Typography>

            {Sentence5.map((item) => (
              <Stack display="flex" key={item.id} flexDirection="row" gap="4px">
                <Typography
                  sx={{
                    fontSize: { md: '16px', sm: '14px', xs: '12px' },
                    color: 'black',
                  }}
                >
                  {item.symbol5}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { md: '16px', sm: '14px', xs: '12px' },
                    color: 'black',
                  }}
                >
                  {item.sentence5}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Typography
            sx={{
              fontSize: { md: '16px', sm: '14px', xs: '12px' },
              color: 'black',
              fontWeight: '500',
              mt: 3,
            }}
          >
            IN WITNESS THEREOF, the parties have executed this DPA as of the effective date of the
            Agreement.
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}

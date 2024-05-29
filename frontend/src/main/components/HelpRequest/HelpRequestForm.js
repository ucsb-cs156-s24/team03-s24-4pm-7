import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();

    // Stryker disable all
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    const tableBreakout_regex = /\b(table|breakout)\b/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Stryker restore all
    const testIdPrefix = "HelpRequestForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requesterEmail">requesterEmail</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-requesterEmail"}
                    id="requesterEmail"
                    type="text"
                    isInvalid={Boolean(errors.requesterEmail)}
                    {...register("requesterEmail", { required: true, pattern: emailRegex })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requesterEmail && 'requesterEmail is required. '}
                    {errors.requesterEmail?.type === 'pattern' && 'emailRegex must be in the form <name@domain.toplevel>. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="teamId">teamId</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-teamId"}
                    id="teamId"
                    type="text"
                    isInvalid={Boolean(errors.teamId)}
                    {...register("teamId", { required: true })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.teamId && 'teamId is required. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="tableOrBreakoutRoom">tableOrBreakoutRoom</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-tableOrBreakoutRoom"}
                    id="tableOrBreakoutRoom"
                    type="text"
                    isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                    {...register("tableOrBreakoutRoom", { required: true, pattern: tableBreakout_regex })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.tableOrBreakoutRoom && 'tableOrBreakoutRoom is required. '}
                    {errors.tableOrBreakoutRoom?.type === 'pattern' && 'tableOrBreakoutRoom must be either the word table or the word breakout. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requestTime">requestTime</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-requestTime"}
                    id="requestTime"
                    type="datetime-local"
                    isInvalid={Boolean(errors.requestTime)}
                    {...register("requestTime", { required: true, pattern: isodate_regex })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requestTime && 'requestTime is required. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">explanation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-explanation"}
                    id="explanation"
                    type="text"
                    isInvalid={Boolean(errors.explanation)}
                    {...register("explanation", { required: true})}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.explanation && 'explanation is required. '}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="solved">solved</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-solved"}
                    id="solved"
                    type="checkbox"
                    isInvalid={Boolean(errors.solved)}
                    {...register("solved")}
                />
            </Form.Group>


            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default HelpRequestForm;
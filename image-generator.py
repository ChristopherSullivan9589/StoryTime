import json
import boto3
import base64
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    try:
        if 'body' in event and event['body']:
            body = json.loads(event['body'])
            text = body.get('text', '')
        else:
            text = event.get('text', '')
        
        if not text:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'text required'})
            }
        
        bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
        
        prompt = f"Create a beautiful, artistic illustration for this story: {text[:500]}..."
        
        request_body = {
            "taskType": "TEXT_IMAGE",
            "textToImageParams": {
                "text": prompt,
                "negativeText": "blurry, low quality, distorted"
            },
            "imageGenerationConfig": {
                "numberOfImages": 1,
                "height": 512,
                "width": 512,
                "cfgScale": 8.0,
                "seed": 0
            }
        }
        
        response = bedrock.invoke_model(
            modelId='amazon.titan-image-generator-v1',
            body=json.dumps(request_body)
        )
        
        response_body = json.loads(response['body'].read())
        
        image_base64 = response_body['images'][0]
        
        s3 = boto3.client('s3')
        bucket_name = 'capstone-story-project'
        filename = f"generated-{hash(text)}.png"
        
        s3.put_object(
            Bucket=bucket_name,
            Key=filename,
            Body=base64.b64decode(image_base64),
            ContentType='image/png'
        )
        
        image_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': filename},
            ExpiresIn=3600
        )
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'imageUrl': image_url})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }